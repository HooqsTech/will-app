import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import BondForm from '../components/Forms/BondForm';
import { useState } from 'react';
import AddButton from '../components/AddButton';
import NextButton from '../components/NextButton';
import { bondsState, IBondState } from '../atoms/BondsState';
import { userState } from '../atoms/UserDetailsState';
import { IsEmptyString } from '../utils';
import { emptyBondValidationState, IBondValidationState, bondsValidationState } from '../atoms/validationStates/BondDetailsValidationState';
import { upsertAsset, deleteAsset } from '../api/asset';
import { ASSET_TYPES, ASSET_SUBTYPES, ROUTE_PATHS } from '../constants';
import DeleteIcon from '@mui/icons-material/Delete';
import BackButton from '../components/BackButton';
import { useLocation, useNavigate } from 'react-router';
import { routesState } from '../atoms/RouteState';

const BondsPage = () => {
    const [formState, setFormState] = useRecoilState<IBondState[]>(bondsState);
    const [validationState, setValidationState] = useRecoilState<IBondValidationState[]>(bondsValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const [showErrorBorder, setShowErrorBorder] = useState(false);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();

    const addBond = () => {
        setFormState((prevState) => [...prevState, {
            id: "",
            type: "",
            financialServiceProviderName: "",
            certificateNumber: ""
        }]);
        setValidationState((prevState) => [...prevState, emptyBondValidationState]);
        setCurrentItem(formState.length);
    };

    const saveBondAsync = async (bond: IBondState, index: number) => {
        const data = {
            id: bond.id,
            type: ASSET_TYPES.BUSINESS_ASSETS,
            subtype: ASSET_SUBTYPES.BONDS,
            userId: user.userId,
            data: bond
        };
        const upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    };

    const handleBackClick = () => {
        var routeValue = routeState.find(s => s.nextPath === location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    };

    const deleteBondAsync = async (index: number) => {
        if (formState[index].id !== ""
            && formState[index].id !== undefined
        ) {
            await deleteAsset(formState[index].id);
        }

        setFormState((prevItems) =>
            prevItems.filter((_, i) => i !== index)
        );

        setValidationState((prevItems) =>
            prevItems.filter((_, i) => i !== index)
        );
    };

    const setBondValidationState = (index: number, key: keyof IBondValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        let isValid = true;
        formState.forEach((bond, index) => {
            if (IsEmptyString(bond.type)) {
                setBondValidationState(index, "type", "Type is required");
                isValid = false;
            }
            if (IsEmptyString(bond.financialServiceProviderName)) {
                setBondValidationState(index, "financialServiceProviderName", "Provider name is required");
                isValid = false;
            }
            if (IsEmptyString(bond.certificateNumber)) {
                setBondValidationState(index, "certificateNumber", "Certificate Number name is required");
                isValid = false;
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    };

    const getBondSubTitle = (index: number) => {
        const { type, financialServiceProviderName, certificateNumber } = formState[index];
        const firstLine = type?.trim() || "";
        const secondLine = [financialServiceProviderName?.trim(), certificateNumber?.trim()].filter(Boolean).join(" - ");
        return [firstLine, secondLine].filter(Boolean).join("\n");
    };

    const handleNextClick = async () => {
        if (!validate()) return;
        formState.forEach(async (bond, index) => {
            await saveBondAsync(bond, index);
        });

        // NAVIGATE TO NEXT ROUTE
        var routeValue = routeState.find(s => s.currentPath == location.pathname);
        navigate(routeValue?.nextPath ?? ROUTE_PATHS.LIABILITIES);
    };

    const shouldExpandAccordion = (index: number) => currentItem === index;

    const handleAccordionOnChange = (index: number) => {
        setCurrentItem((prevItem) => prevItem === index ? -1 : index)
        setShowErrorBorder(false);
    }

    return (
        <div className='flex flex-col justify-start h-full space-y-3 w-xl m-auto'>
            <h1 className='text-2xl font-semibold'>Bonds</h1>
            <div>
                {formState.map((_, index) => (
                    <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                        <div className='w-full h-full'>
                            <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                onChange={() => handleAccordionOnChange(index)}
                                label={`Bond ${index + 1}`}
                                subTitle={
                                    currentItem !== index && !shouldExpandAccordion(index) ? getBondSubTitle(index) : ""
                                }
                            >
                                <BondForm index={index} />
                            </CustomAccordion>
                        </div>
                        {!shouldExpandAccordion(index) && (
                            <button onClick={() => deleteBondAsync(index)} className='p-2 h-full bg-will-green'>
                                <DeleteIcon fontSize="small" className='text-white bg-will-green' />
                            </button>
                        )}
                    </div>
                ))}
                <AddButton onClick={addBond} label={`Bond ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    );
};

export default BondsPage;
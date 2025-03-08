import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { deleteAsset, upsertAsset } from '../api/asset';
import { debenturesState, IDebentureState } from '../atoms/DebenturesState';
import { routesState } from '../atoms/RouteState';
import { userState } from '../atoms/UserDetailsState';
import { debenturesValidationState, emptyDebentureValidationState, IDebentureValidationState } from '../atoms/validationStates/DebentureValidationState';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import CustomAccordion from '../components/CustomAccordion';
import DebentureForm from '../components/Forms/DebentureForm';
import NextButton from '../components/NextButton';
import { ASSET_SUBTYPES, ASSET_TYPES, ROUTE_PATHS } from '../constants';
import { IsEmptyString } from '../utils';

const DebenturesPage = () => {
    const [formState, setFormState] = useRecoilState<IDebentureState[]>(debenturesState);
    const [validationState, setValidationState] = useRecoilState<IDebentureValidationState[]>(debenturesValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const [showErrorBorder, setShowErrorBorder] = useState(false);
    const user = useRecoilValue(userState);
    const routeState = useRecoilValue(routesState);
    const navigate = useNavigate();
    const location = useLocation();

    const shouldExpandAccordion = (index: number) => currentItem === index;

    const handleBackClick = () => {
        var routeValue = routeState.find(s => s.nextPath === location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    };

    const addItem = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                type: "",
                financialServiceProviderName: "",
                certificateNumber: ""
            },
        ]);
        setValidationState((prevState) => [...prevState, emptyDebentureValidationState]);
        setCurrentItem(formState.length);
    };

    const saveDebentureAsync = async (debenture: IDebentureState, index: number) => {
        const data = {
            id: debenture.id,
            type: ASSET_TYPES.BUSINESS_ASSETS,
            subtype: ASSET_SUBTYPES.DEBENTURES,
            userId: user.userId,
            data: debenture
        };
        const upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    };

    const deleteDebentureAsync = async (index: number) => {
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

    const setDebentureValidationState = (index: number, key: keyof IDebentureValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        let isValid = true;
        formState.forEach((debenture, index) => {
            if (IsEmptyString(debenture.type)) {
                setDebentureValidationState(index, "type", "Type is required");
                isValid = false;
            }
            if (IsEmptyString(debenture.financialServiceProviderName)) {
                setDebentureValidationState(index, "financialServiceProviderName", "Provider Name is required");
                isValid = false;
            }
            if (IsEmptyString(debenture.certificateNumber)) {
                setDebentureValidationState(index, "certificateNumber", "Certificate Number is required");
                isValid = false;
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    };

    const getDebentureSubTitle = (index: number) => {
        const { type, financialServiceProviderName, certificateNumber } = formState[index];
        const firstLine = type?.trim() || "";
        const secondLine = [financialServiceProviderName?.trim(), certificateNumber?.trim()].filter(Boolean).join(" - ");
        return [firstLine, secondLine].filter(Boolean).join("\n");
    };

    const handleNextClick = async () => {
        if (!validate()) return;
        formState.forEach(async (debenture, index) => {
            await saveDebentureAsync(debenture, index);
        });
        // NAVIGATE TO NEXT ROUTE
        var routeValue = routeState.find(s => s.currentPath == location.pathname);
        navigate(routeValue?.nextPath ?? ROUTE_PATHS.LIABILITIES);
    };


    const handleAccordionOnChange = (index: number) => {
        setCurrentItem((prevItem) => (prevItem === index ? -1 : index));
        setShowErrorBorder(false);
    };

    return (
        <div className='flex flex-col justify-start h-full space-y-3 w-xl m-auto'>
            <h1 className='text-2xl font-semibold'>Debentures</h1>
            <div>
                {formState.map((_, index) => (
                    <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                        <div className='w-full h-full'>
                            <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                onChange={() => handleAccordionOnChange(index)}
                                label={`Debenture ${index + 1}`}
                                subTitle={
                                    currentItem !== index && !shouldExpandAccordion(index) ? getDebentureSubTitle(index) : ""
                                }
                            >
                                <DebentureForm index={index} />
                            </CustomAccordion>
                        </div>
                        {!shouldExpandAccordion(index) && (
                            <button onClick={() => deleteDebentureAsync(index)} className='p-2 h-full bg-will-green'>
                                <DeleteIcon fontSize='small' className='text-white bg-will-green' />
                            </button>
                        )}
                    </div>
                ))}
                <AddButton onClick={addItem} label={`Debenture ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    );
};

export default DebenturesPage;

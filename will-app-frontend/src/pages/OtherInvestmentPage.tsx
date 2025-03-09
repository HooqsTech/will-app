
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { deleteAsset, upsertAsset } from '../api/asset';
import { IOtherInvestmentState, otherInvestmentState } from '../atoms/OtherInvestmentsState';
import { routesState } from '../atoms/RouteState';
import { userState } from '../atoms/UserDetailsState';
import { emptyOtherInvestmentValidationState, IOtherInvestmentValidationState, otherInvestmentValidationState } from '../atoms/validationStates/OtherInvestmentValidationState';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import CustomAccordion from '../components/CustomAccordion';
import OtherInvestmentForm from '../components/Forms/OtherInvestmentForm';
import NextButton from '../components/NextButton';
import { ASSET_SUBTYPES, ASSET_TYPES, ROUTE_PATHS } from '../constants';
import { IAsset } from '../models/asset';
import { IsEmptyString } from '../utils';

const OtherInvestmentPage = () => {
    const [formState, setFormState] = useRecoilState<IOtherInvestmentState[]>(otherInvestmentState);
    const [validationState, setValidationState] = useRecoilState<IOtherInvestmentValidationState[]>(otherInvestmentValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const saveOtherInvestmentsAsync = async (property: IOtherInvestmentState, index: number) => {
        let data: IAsset = {
            id: "",
            type: ASSET_TYPES.BUSINESS_ASSETS,
            subtype: ASSET_SUBTYPES.OTHER_INVESTMENTS,
            userId: user.userId,
            data: property
        }
        let upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    }

    const deleteOtherInvestmentsAsync = async (index: number) => {
        let isDeleted = await deleteAsset(formState[index].id);
        if (isDeleted) {

            setFormState((prevItems) =>
                prevItems.filter(item => item.id !== formState[index].id)
            );
        }
    }

    const handleBackClick = async () => {
        // NAVIGATE TO PREVIOUS ROUTE
        let routeValue = routeState.find(s => s.nextPath == location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    };

    const setPropertyValidationState = (index: number, key: keyof IOtherInvestmentValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        let isValid: boolean = true;
        formState.forEach((prop, index) => {
            if (IsEmptyString(prop.type)) {
                setPropertyValidationState(index, "type", "Type is required");
                isValid = false;
            }
            if (IsEmptyString(prop.financialServiceProviderName)) {
                setPropertyValidationState(index, "financialServiceProviderName", "Bank / Financial Service Provider Name is required");
                isValid = false;
            }
            if (IsEmptyString(prop.certificateNumber)) {
                setPropertyValidationState(index, "certificateNumber", "Certificate / Folio Number is required");
                isValid = false;
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    }

    const handleNextClick = async () => {
        // VALIDATE
        if (!validate()) return;

        // SAVE PROPERTIES
        formState.forEach(async (property, index) => {
            await saveOtherInvestmentsAsync(property, index);
        })

        // NAVIGATE TO NEXT ROUTE
        let routeValue = routeState.find(s => location.pathname.includes(s.currentPath));
        navigate(ROUTE_PATHS.YOUR_WILL + (routeValue?.nextPath ?? ROUTE_PATHS.LIABILITIES));
    }


    const addOtherInvestments = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                type: "",
                financialServiceProviderName: "",
                certificateNumber: ""
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyOtherInvestmentValidationState
        ])
        setCurrentItem(formState.length);
    };


    const getSubTitle = (index: number) => {
        const { type, financialServiceProviderName, certificateNumber } = formState[index];
        const firstLine = type?.trim() || "";
        const secondLine = [financialServiceProviderName?.trim(), certificateNumber?.trim()].filter(Boolean).join(" - ");
        return [firstLine, secondLine].filter(Boolean).join("\n");
    }

    const shouldExpandAccordion = (index: number) => {
        return currentItem === index
    }

    const handleAccordionOnChange = (index: number) => {
        setCurrentItem((prevItem) => prevItem === index ? -1 : index)
        setShowErrorBorder(false);
    }

    return (
        <div className='flex flex-col justify-start h-full space-y-3 w-xl m-auto'>
            <h1 className='text-2xl font-semibold'>Other Investments</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`OTHER INVESTMENT ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <OtherInvestmentForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <button onClick={() => deleteOtherInvestmentsAsync(index)} className='p-2 h-full bg-will-green'>
                                        <DeleteIcon fontSize="small" className='text-white bg-will-green' />
                                    </button>
                                )
                            }

                        </div>
                    ))
                }
                <AddButton onClick={addOtherInvestments} label={`OTHER INVESTMENT ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    )

}

export default OtherInvestmentPage;  

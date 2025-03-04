import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { IPensionAccountState , pensionAccountsState} from '../atoms/PensionAccountsState';
import PensionAccountForm from '../components/Forms/PensionAccountForm';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import { useLocation, useNavigate } from 'react-router';
import { routesState } from '../atoms/RouteState';
import { deleteAsset, upsertAsset } from '../api/asset';
import { ASSET_SUBTYPES, ASSET_TYPES } from '../constants';
import { IAsset } from '../models/asset';
import { userState } from '../atoms/UserDetailsState';
import { IsEmptyString } from '../utils';
import DeleteIcon from '@mui/icons-material/Delete';
import { emptyPropertyValidationState, IPensionAccountValidationState, pensionAccountValidationState } from '../atoms/validationStates/PensionAccountValidationState';

const PensionAccountPage = () => {
    const [formState, setFormState] = useRecoilState<IPensionAccountState[]>(pensionAccountsState);
    const [validationState, setValidationState] = useRecoilState<IPensionAccountValidationState[]>(pensionAccountValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    const [showErrorBorder, setShowErrorBorder] = useState(false);


    const saveProvidentFundAsync = async (property: IPensionAccountState,index: number) => {
                let data: IAsset = {
                    id: "",
                    type: ASSET_TYPES.FINANCIAL_ASSETS,
                    subtype: ASSET_SUBTYPES.PROVIDENT_FUNDS,
                    userId: user.userId,
                    data: property
                }
                let upsertedAsset = await upsertAsset(data);
        
                setFormState((prevItems) =>
                    prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
                );
            }

    const deletePensionAccountAsync = async (index: number) => {
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
                
    const setPropertyValidationState = (index: number, key: keyof IPensionAccountValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        let isValid: boolean = true;
        formState.forEach((prop, index) => {
            if (IsEmptyString(prop.bankName)) {
                setPropertyValidationState(index, "bankName", "Bank Name is required");
                isValid = false;
            }
            if (IsEmptyString(prop.schemeName)) {
                setPropertyValidationState(index, "schemeName", "Schema Name is required");
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
            await saveProvidentFundAsync(property, index);
        })

        // NAVIGATE TO NEXT ROUTE
        let routeValue = routeState.find(s => s.currentPath == location.pathname);
        navigate(routeValue?.nextPath ?? "/");
    }

    const addPensionAccountAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                schemeName: "",
                bankName: "",
            },
        ]);

        setValidationState((prevState) => [
                                            ...prevState,
                                            emptyPropertyValidationState
                                        ])
        setCurrentItem(formState.length)

    };

    const getSubTitle = (index: number) => {
        const { bankName,schemeName  } = formState[index];
        const firstLine = bankName?.trim() || "";
        const secondLine = [schemeName?.trim()].filter(Boolean).join(" - ");
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
        <h1 className='text-2xl font-semibold'>PENSION ACCOUNTS</h1>
        <div>
            {
                formState.map((_, index) => (
                    <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                        <div className='w-full h-full'>
                            <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                onChange={() => handleAccordionOnChange(index)}
                                label={`PENSION ACCOUNT ${index + 1}`}
                                subTitle={
                                    currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                }
                            >
                                <PensionAccountForm index={index} />
                            </CustomAccordion>
                        </div>
                        {
                            !shouldExpandAccordion(index) && (
                                <button onClick={() => deletePensionAccountAsync(index)} className='p-2 h-full bg-will-green'>
                                    <DeleteIcon fontSize="small" className='text-white bg-will-green' />
                                </button>
                            )
                        }

                    </div>
                ))
            }
            <AddButton onClick={addPensionAccountAsset} label={`PENSION ACCOUNT ${formState.length + 1}`} />
        </div>
        <div className='justify-between flex mt-10'>
            <BackButton label='Back' onClick={handleBackClick} />
            <NextButton label='Next' onClick={handleNextClick} />
        </div>
    </div>
    )
    
}

export default PensionAccountPage;   
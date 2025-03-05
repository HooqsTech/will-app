
import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { IDematAccountState, dematAccountsState } from '../atoms/DematAccountsState';
import DematAccountForm from '../components/Forms/DematAccountForm';
import { emptyDematAccountsValidationState, IDematAccountValidationState, dematAccountValidationState } from '../atoms/validationStates/DematAccountValidationState';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import { routesState } from '../atoms/RouteState';
import { useLocation, useNavigate } from 'react-router';
import { IAsset } from '../models/asset';
import { deleteAsset, upsertAsset } from '../api/asset';
import { userState } from '../atoms/UserDetailsState';
import { ASSET_SUBTYPES, ASSET_TYPES } from '../constants';
import { IsEmptyString } from '../utils';
import DeleteIcon from '@mui/icons-material/Delete';

const DematAccountPage = () => {
    const [formState, setFormState] = useRecoilState<IDematAccountState[]>(dematAccountsState);
    const [validationState, setValidationState] = useRecoilState<IDematAccountValidationState[]>(dematAccountValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const saveDematAccountAsync = async (property: IDematAccountState, index: number) => {
        let data: IAsset = {
            id: property.id,
            type: ASSET_TYPES.FINANCIAL_ASSETS,
            subtype: ASSET_SUBTYPES.DEMAT_ACCOUNTS,
            userId: user.userId,
            data: property
        }
        let upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    }

    const deleteDematAccountAsync = async (index: number) => {
        if (formState[index].id !== ""
            && formState[index].id !== undefined
        ) {
            await deleteAsset(formState[index].id);
        }

        setFormState((prevItems) =>
            prevItems.filter((_, i) => i !== index)
        );

        setFormState((prevItems) =>
            prevItems.filter((_, i) => i !== index)
        );
    }

    const handleBackClick = async () => {
        // NAVIGATE TO PREVIOUS ROUTE
        let routeValue = routeState.find(s => s.nextPath == location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    }

    const setPropertyValidationState = (index: number, key: keyof IDematAccountValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        let isValid: boolean = true;
        formState.forEach((prop, index) => {
            if (IsEmptyString(prop.accountNumber)) {
                setPropertyValidationState(index, "accountNumber", "Account Number is required");
                isValid = false;
            }
            if (IsEmptyString(prop.brokerName)) {
                setPropertyValidationState(index, "brokerName", "Broker Name is required");
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
            await saveDematAccountAsync(property, index);
        })

        // NAVIGATE TO NEXT ROUTE
        let routeValue = routeState.find(s => s.currentPath == location.pathname);
        navigate(routeValue?.nextPath ?? "/");
    }

    const addDematAccountAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                brokerName: "",
                accountNumber: ""
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyDematAccountsValidationState
        ])
        setCurrentItem(formState.length);
    };

    const getSubTitle = (index: number) => {
        const { accountNumber, brokerName } = formState[index];
        const firstLine = accountNumber?.trim() || "";
        const secondLine = [brokerName?.trim()].filter(Boolean).join(" - ");
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
            <h1 className='text-2xl font-semibold'>Demat Accounts</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`DEMAT ACCOUNT ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <DematAccountForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <button onClick={() => deleteDematAccountAsync(index)} className='p-2 h-full bg-will-green'>
                                        <DeleteIcon fontSize="small" className='text-white bg-will-green' />
                                    </button>
                                )
                            }

                        </div>
                    ))
                }
                <AddButton onClick={addDematAccountAsset} label={`DEMAT ACCOUNT ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton label='Next' onClick={handleNextClick} />
            </div>
        </div>
    )

}

export default DematAccountPage;   
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { deleteAsset, upsertAsset } from '../api/asset';
import { fixedDepositsState, IFixedDepositState } from '../atoms/FixedDepositState';
import { routesState } from '../atoms/RouteState';
import { userState } from '../atoms/UserDetailsState';
import { emptyFixedDepositsValidationState, fixedDepositsValidationState, IFixedDepositValidationState } from '../atoms/validationStates/FixedDepositValidationState';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import CustomAccordion from '../components/CustomAccordion';
import FixedDepositForm from '../components/Forms/FixedDepositForm';
import NextButton from '../components/NextButton';
import { ASSET_SUBTYPES, ASSET_TYPES } from '../constants';
import { IAsset } from '../models/asset';
import { IsEmptyString } from '../utils';

const FixedDepositsPage = () => {
    const [formState, setFormState] = useRecoilState<IFixedDepositState[]>(fixedDepositsState);
    const [validationState, setValidationState] = useRecoilState<IFixedDepositValidationState[]>(fixedDepositsValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const saveFixedDepositAsync = async (fixedDeposit: IFixedDepositState, index: number) => {
        var data: IAsset = {
            id: fixedDeposit.id,
            type: ASSET_TYPES.FINANCIAL_ASSETS,
            subtype: ASSET_SUBTYPES.FIXED_DEPOSITS,
            userId: user.userId,
            data: fixedDeposit
        }
        var upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    }

    const deleteFixedDeposit = async (index: number) => {
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

    }

    const handleBackClick = async () => {
        // NAVIGATE TO PREVIOUS ROUTE
        var routeValue = routeState.find(s => s.nextPath == location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    }

    const setFixedDepositValidationState = (index: number, key: keyof IFixedDepositValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        var isValid: boolean = true;
        formState.forEach((prop, index) => {
            if (IsEmptyString(prop.noOfHolders)) {
                setFixedDepositValidationState(index, "noOfHolders", "No of holders is required");
                isValid = false;
            }

            if (IsEmptyString(prop.bankName)) {
                setFixedDepositValidationState(index, "bankName", "bank name is required");
                isValid = false;
            }

            if (IsEmptyString(prop.accountNumber)) {
                setFixedDepositValidationState(index, "accountNumber", "account number is required");
                isValid = false;
            }

            if (IsEmptyString(prop.branch)) {
                setFixedDepositValidationState(index, "branch", "branch is required");
                isValid = false;
            }

            if (IsEmptyString(prop.city)) {
                setFixedDepositValidationState(index, "city", "city is required");
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
            await saveFixedDepositAsync(property, index);
        })

        // NAVIGATE TO NEXT ROUTE
        var routeValue = routeState.find(s => s.currentPath == location.pathname);
        navigate(routeValue?.nextPath ?? "/");
    }

    const addProperty = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                noOfHolders: "",
                accountNumber: "",
                bankName: "",
                branch: "",
                city: ""
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyFixedDepositsValidationState
        ])
        setCurrentItem(formState.length);
    };

    const getSubTitle = (index: number) => {
        const { bankName, accountNumber, city, branch } = formState[index];
        const firstLine = bankName?.trim() || "";
        const secondLine = accountNumber.trim() || "";
        const thirdLine = [branch?.trim(), city?.trim()].filter(Boolean).join(" - ");
        return [firstLine, secondLine, thirdLine].filter(Boolean).join("\n");
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
            <h1 className='text-2xl font-semibold'>Fixed Deposits</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`Fixed Deposit ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <FixedDepositForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <button onClick={() => deleteFixedDeposit(index)} className='p-2 h-full bg-will-green'>
                                        <DeleteIcon fontSize="small" className='text-white bg-will-green' />
                                    </button>
                                )
                            }

                        </div>
                    ))
                }
                <AddButton onClick={addProperty} label={`Fixed Deposit ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton label='Save & Next' onClick={handleNextClick} />
            </div>
        </div>
    )
}

export default FixedDepositsPage   
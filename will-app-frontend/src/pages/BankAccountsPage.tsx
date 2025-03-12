
import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import BankAccountForm from '../components/Forms/BankAccountForm';
import { useState } from 'react';
import { IBankDetailsState, bankDetailsState } from '../atoms/BankDetailsState';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import { IAsset } from '../models/asset';
import { ASSET_SUBTYPES, ASSET_TYPES, ROUTE_PATHS } from '../constants';
import { userState } from '../atoms/UserDetailsState';
import { deleteAsset, upsertAsset } from '../api/asset';
import { routesState } from '../atoms/RouteState';
import { useNavigate } from 'react-router';
import { IsEmptyString } from '../utils';
import { bankDetailsValidationState, emptyBankAccountValidationState, IBankDetailsValidationState } from '../atoms/validationStates/BankDetailsValidationState';
import AddButton from '../components/AddButton';
import ConfirmDelete from "../components/ConfirmDelete";

const BankAccountsPage = () => {
    const [formState, setFormState] = useRecoilState<IBankDetailsState[]>(bankDetailsState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const user = useRecoilValue(userState);
    const routeState = useRecoilValue(routesState);
    const navigate = useNavigate();
    const [validationState, setValidationState] = useRecoilState<IBankDetailsValidationState[]>(bankDetailsValidationState);
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const addBankAccount = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                accountType: "",
                accountNumber: "",
                bankName: "",
                branch: "",
                city: ""
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyBankAccountValidationState
        ])
        setCurrentItem(formState.length)
    };

    const savePropertyAsync = async (property: IBankDetailsState, index: number) => {
        var data: IAsset = {
            id: property.id,
            type: ASSET_TYPES.FINANCIAL_ASSETS,
            subtype: ASSET_SUBTYPES.BANK_ACCOUNTS,
            userId: user.userId,
            data: property
        }
        var upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    }

    const getSubTitle = (index: number) => {
        const { bankName, accountType, accountNumber } = formState[index];

        const firstLine = bankName?.trim() || "";
        const secondLine = [accountType?.trim(), accountNumber?.trim()].filter(Boolean).join(" - ");

        return [firstLine, secondLine].filter(Boolean).join("\n");
    }

    const handleBackClick = async () => {
        // NAVIGATE TO PREVIOUS ROUTE
        var routeValue = routeState.find(s => s.nextPath == location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    }

    const setBankAccountValidationState = (index: number, key: keyof IBankDetailsValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        var isValid: boolean = true;
        formState.forEach((prop, index) => {
            if (IsEmptyString(prop.accountType)) {
                setBankAccountValidationState(index, "accountType", "account type is required");
                isValid = false;
            }

            if (IsEmptyString(prop.accountNumber)) {
                setBankAccountValidationState(index, "accountNumber", "account number is required");
                isValid = false;
            }

            if (IsEmptyString(prop.bankName)) {
                setBankAccountValidationState(index, "bankName", "bank name is required");
                isValid = false;
            }

            if (IsEmptyString(prop.branch)) {
                setBankAccountValidationState(index, "branch", "branch is required");
                isValid = false;
            }

            if (IsEmptyString(prop.city)) {
                setBankAccountValidationState(index, "city", "city is required");
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
            await savePropertyAsync(property, index);
        })

        // NAVIGATE TO NEXT ROUTE
        var routeValue = routeState.find(s => location.pathname.includes(s.currentPath));
        navigate(ROUTE_PATHS.YOUR_WILL + (routeValue?.nextPath ?? ROUTE_PATHS.LIABILITIES));
    }

    const shouldExpandAccordion = (index: number) => {
        return currentItem === index
    }

    const deleteAssetAsync = async (index: number) => {
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

    const handleAccordionOnChange = (index: number) => {
        setCurrentItem((prevItem) => prevItem === index ? -1 : index)
        setShowErrorBorder(false);
    }

    return (
        <div className='flex flex-col justify-start h-full space-y-3 w-xl m-auto'>
            <h1 className='text-2xl font-semibold'>Bank Accounts</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={currentItem === index}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`Bank Accounts ${index + 1}`}
                                    subTitle={
                                        currentItem !== index ? getSubTitle(index) : ""
                                    }
                                    children={
                                        <BankAccountForm index={index} />
                                    }
                                />
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <ConfirmDelete onConfirm={() => deleteAssetAsync(index)} />
                                )
                            }
                        </div>
                    ))
                }
                <AddButton onClick={addBankAccount} label={`Bank account ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    )
}

export default BankAccountsPage;   
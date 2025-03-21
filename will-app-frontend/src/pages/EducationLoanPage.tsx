
import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import { useLocation, useNavigate } from 'react-router';
import { routesState } from '../atoms/RouteState';
import { deleteAsset, upsertAsset } from '../api/asset';
import { ASSET_SUBTYPES, ASSET_TYPES, ROUTE_PATHS } from '../constants';
import { IAsset } from '../models/asset';
import { userState } from '../atoms/UserDetailsState';
import { IsEmptyNumber, IsEmptyString } from '../utils';
import ConfirmDelete from "../components/ConfirmDelete";
import EducationLoanForm from '../components/Forms/EducationLoanForm';
import { educationLoansState, IEducationLoanState } from '../atoms/EducationsLoanState';
import { educationLoanValidationState, emptyEducationLoanValidationState, IEducationLoanValidationState } from '../atoms/validationStates/EducationLoanValidationState';


const EducationLoanPage = () => {
    const [formState, setFormState] = useRecoilState<IEducationLoanState[]>(educationLoansState);
    const [validationState, setValidationState] = useRecoilState<IEducationLoanValidationState[]>(educationLoanValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const saveEducationLoanAsync = async (property: IEducationLoanState, index: number) => {
        let data: IAsset = {
            id: "",
            type: ASSET_TYPES.LIABILITIES,
            subtype: ASSET_SUBTYPES.EDUCATION_LOAN,
            userId: user.userId,
            data: property
        }
        let upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    }

    const deleteEducationLoanAsync = async (index: number) => {
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

    const setPropertyValidationState = (index: number, key: keyof IEducationLoanValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        let isValid: boolean = true;
        formState.forEach((prop, index) => {
            if (IsEmptyString(prop.nameOfBank)) {
                setPropertyValidationState(index, "nameOfBank", "BankName is required");
                isValid = false;
            }
            if (IsEmptyNumber(prop.loanAmount)) {
                setPropertyValidationState(index, "loanAmount", "Loan Amount is required");
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
            await saveEducationLoanAsync(property, index);
        })

        // NAVIGATE TO NEXT ROUTE
        let routeValue = routeState.find(s => location.pathname.includes(s.currentPath));
        navigate(ROUTE_PATHS.YOUR_WILL + (routeValue?.nextPath ?? ROUTE_PATHS.BENEFICIARIES));
    }


    const addEducationLoan = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                nameOfBank: "",
                loanAmount: undefined,
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyEducationLoanValidationState
        ])
        setCurrentItem(formState.length);
    };


    const getSubTitle = (index: number) => {
        const { loanAmount, nameOfBank } = formState[index];
        const firstLine = nameOfBank?.trim() || "";
        const secondLine = [loanAmount ? "Rs. " + loanAmount : ""].filter(Boolean).join(" - ");
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
            <h1 className='text-2xl font-semibold'>Education Loans</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`EDUCATION LOAN ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <EducationLoanForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <ConfirmDelete onConfirm={() => deleteEducationLoanAsync(index)} />
                                )
                            }

                        </div>
                    ))
                }
                <AddButton onClick={addEducationLoan} label={`EDUCATION LOAN ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    )

}

export default EducationLoanPage;  

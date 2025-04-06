import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { deleteExecutor, upsertExecutor } from '../api/executor';
import { executorState, IExecutorState } from '../atoms/ExecutorState';
import { userState } from '../atoms/UserDetailsState';
import { emptyExecutorValidationState, executorValidationState, IExecutorValidationState } from '../atoms/validationStates/ExecutorValidationState';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import ConfirmDelete from '../components/ConfirmDelete';
import ExecutorForm from '../components/Forms/ExecutorForm';
import NextButton from '../components/NextButton';
import { ROUTE_PATHS } from '../constants';
import { IExecutor, IExecutorDeleteRequest } from '../models/executor';
import { IsEmptyString, isValidAadhaar, IsValidEmail, IsValidPhoneNumber } from '../utils';
import CustomAccordion from '../components/CustomAccordion';
import Swal from 'sweetalert2';

const ExecutorPage = () => {
    const [formState, setFormState] = useRecoilState<IExecutorState[]>(executorState);
    const [validationState, setValidationState] = useRecoilState<IExecutorValidationState[]>(executorValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const [error, setError] = useState<boolean>(false);
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    useEffect(() => {
        setCurrentItem(formState.length + 1)
    }, [])

    const saveExecutorAsync = async (property: IExecutorState, index: number) => {
        let data: IExecutor = {
            id: property.id,
            userId: user.userId,
            data: property
        }
        let upsertedExecutor = await upsertExecutor(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedExecutor.data, id: upsertedExecutor.id } : item))
        );
    }

    const deleteExecutorAsync = async (index: number) => {
        if (formState[index].id !== ""
            && formState[index].id !== undefined
        ) {
            let data: IExecutorDeleteRequest = {
                id: formState[index].id,
                userId: user.userId
            }
            await deleteExecutor(data);
        }

        setFormState((prevItems) =>
            prevItems.filter((_, i) => i !== index)
        );

        setValidationState((prevItems) =>
            prevItems.filter((_, i) => i !== index)
        );
    }

    const setPropertyValidationState = (index: number, key: keyof IExecutorValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        let isValid: boolean = true;
        formState.forEach((prop, index) => {
            let age = dayjs().diff(dayjs(prop.dob), "year");
            if (IsEmptyString(prop.fullName)) {
                setPropertyValidationState(index, "fullName", "Name is required");
                isValid = false;
            }

            if (IsEmptyString(prop.gender)) {
                setPropertyValidationState(index, "gender", "Gender is required");
                isValid = false;
            }

            if (IsEmptyString(prop.dob)) {
                setPropertyValidationState(index, "dob", "DOB is required");
                isValid = false;
            }

            if (prop.dob !== "" && age <= 18) {
                setPropertyValidationState(index, "dob", "Executor age must be greater than 18");
                isValid = false;
            }

            if (IsEmptyString(prop.email)) {
                setPropertyValidationState(index, "email", "Email is required");
                isValid = false;
            }

            if (IsEmptyString(prop.aadhaarNumber)) {
                setPropertyValidationState(index, "aadhaarNumber", "Aadhaar number is required");
                isValid = false;
            }

            if (!isValidAadhaar(prop.aadhaarNumber)) {
                setPropertyValidationState(index, "aadhaarNumber", "Aadhaar number is required");
                isValid = false;
            }

            if (!IsValidEmail(prop.email)) {
                setPropertyValidationState(index, "email", "Email is invalid");
                isValid = false;
            }

            if (IsEmptyString(prop.phoneNumber)) {
                setPropertyValidationState(index, "phoneNumber", "Phone is required");
                isValid = false;
            }

            if (!IsValidPhoneNumber(prop.phoneNumber)) {
                setPropertyValidationState(index, "phoneNumber", "Phone is invalid");
                isValid = false;
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    }

    const handleNextClick = async () => {
        if (!validate()) return;
        if (formState.length >= 1) {
            setError(false);
            formState.forEach(async (person, index) => {
                await saveExecutorAsync(person, index);
            });
            Swal.fire({
                title: "Are you sure Proceed to Order Summary",
                text: "Ready to move to Order Summary Section? Click No to Add more executor",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "var(--color-will-green)",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, go to Order Summary",
                cancelButtonText: "No",
                customClass: {
                popup: "swal-sm",
                title: "swal-title",
                confirmButton: "swal-confirm-btn",
                },
            }).then((result) => {
                if (result.isConfirmed) {
                navigate(ROUTE_PATHS.ORDER_SUMMARY);
                }
                else
                {
                 return
                }
            });
        }
        else {
            setError(true);
        }
    }

    const addExecutorItem = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                fullName: "",
                gender: "",
                aadhaarNumber: "",
                dob: "",
                email: "",
                phoneNumber: ""
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyExecutorValidationState
        ])
        setCurrentItem(formState.length);
        setError(false);
    };

    const getSubTitle = (index: number) => {
        const { fullName, email } = formState[index];
        return [fullName?.trim(), email?.trim()].filter(Boolean).join(" - ");
    };

    const shouldExpandAccordion = (index: number) => {
        return currentItem === index;
    };

    const handleAccordionOnChange = (index: number) => {
        setCurrentItem((prevItem) => prevItem === index ? -1 : index);
        setShowErrorBorder(false);
    };

    return (
        <div className='flex flex-col justify-start h-full space-y-3 w-xl m-auto'>
            <h1 className='text-2xl font-semibold'>Choose Your Will Executors</h1>
            <h2 className="text-md mb-5">
                Ensure your wishes are followed accurately and minimise the possibility of objections, by choosing the right person to execute your Will.
            </h2>
            <h2 className="text-md mb-5">
                Please choose an executor that is a trusted relative, family friend, lawyer, CA, or any professional, and is above the age of 18.
            </h2>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`Executor ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <ExecutorForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <ConfirmDelete onConfirm={() => deleteExecutorAsync(index)} />
                                )
                            }
                        </div>
                    ))
                }
                <AddButton onClick={addExecutorItem} label={`EXECUTOR ${formState.length + 1}`} />
            </div>
            {error && <p className="mt-3 text-red-500">Please add executor before proceeding to next step.</p>}
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    )
}

export default ExecutorPage;  
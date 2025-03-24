import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useState } from 'react';
import { routesState } from '../atoms/RouteState';
import { userState } from '../atoms/UserDetailsState';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import {  ROUTE_PATHS } from '../constants';
import {  IsEmptyString } from '../utils';
import { useLocation, useNavigate } from 'react-router';
import { Modal } from '@mui/material';
import { guardianModalState } from '../atoms/GuardianModelState';
import CustomButton from '../components/CustomButton';
import dayjs from 'dayjs';
import { executorState, IExecutorState } from '../atoms/ExecutorState';
import { emptyExecutorValidationState, executorValidationState, IExecutorValidationState } from '../atoms/validationStates/ExecutorValidationState';
import ExecutorForm from '../components/Forms/ExecutorForm';
import EditButton from '../components/EditButton';
import ConfirmDelete from '../components/ConfirmDelete';
import { IExecutor, IExecutorDeleteRequest } from '../models/executor';
import { deleteExecutor, upsertExecutor } from '../api/executor';

const ExecutorPage = () => {
    const [formState, setFormState] = useRecoilState<IExecutorState[]>(executorState);
    const  setValidationState = useSetRecoilState<IExecutorValidationState[]>(executorValidationState);
    const [currentItem, setCurrentItem] = useState<number>(1);
    const user = useRecoilValue(userState);
    const routeState = useRecoilValue(routesState);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useRecoilState(guardianModalState);

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

    const handleBackClick = async () => {
        // NAVIGATE TO PREVIOUS ROUTE
        navigate(ROUTE_PATHS.MY_PLAN);
    };

    const setPropertyValidationState = (index: number, key: keyof IExecutorValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };


    const validate = (index: number) => {
        let isValid: boolean = true;
        let prop = formState[index];
        let age = dayjs().diff(dayjs(formState[index].dob), "year");
        
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
        if (prop.dob !== "" && age <= 18 ) {
            setPropertyValidationState(index, "dob", "Executor age must be greater than 18");
            isValid = false;
        }
        if (IsEmptyString(prop.email)) {
            setPropertyValidationState(index, "email", "Email is required");
            isValid = false;
        }
        if (IsEmptyString(prop.phoneNumber)) {
            setPropertyValidationState(index, "phoneNumber", "Phone is required");
            isValid = false;
        }
        
        return isValid;
    }

    const handleNextClick = async () => {
        navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.ASSET_DISTRIBUTION);
    }

    const handleSaveExecutorAsync = async (index: number) => {
        // VALIDATE
        if (!validate(index)) return;

        await saveExecutorAsync(formState[index], index);

        setIsOpen(false);
    }


    const addExecutorItem = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                fullName: "",
                gender: "",
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
        setIsOpen(true);
    };

    const onEdit = (index:number) => {
        setCurrentItem(index);
        setIsOpen(true);
    }


    return (
        <div className='flex flex-col justify-start text-center h-full space-y-3 w-xl m-auto'>
            <h1 className='text-2xl font-semibold'>Choose Your Will Executors</h1>
            <h2 className="text-md mb-5">
            Ensure your wishes are followed accurately and minimise the possibility of objections, by choosing the right person to execute your Will.
            </h2>
            <h2 className="text-md mb-5">
            Please choose an executor that is a trusted relative, family friend, lawyer, CA, or any professional, and is above the age of 18.
            </h2>
            <div>
                {formState.filter(f => f.id != "").map((_, index) => (
                <div key={formState[index].id} className="relative flex box-border my-3 p-6 border bg-[#FFFFFFB2] border-[#FFFFFF33] rounded-xl shadow-[3px_3px_6px_0_#B4CBE240]">
                    <div className="flex flex-col gap-y-5">
                        <div className="flex items-center">
                        <p className="header first-letter:capitalize">{`Executor ${index + 1}`}</p>
                        </div>
                        <div>
                        <p className="desc">{formState[index].fullName}</p>
                        </div>
                    </div>
                    {/* Edit and Delete Icons */}
                    <div className="absolute bottom-[22px] right-6">
                        <div className="inline-flex gap-x-8 justify-end items-center">
                        <div className="inline-flex gap-x-2 items-center cursor-pointer">
                            <EditButton onClick={() => onEdit(index + 1)} className=" hover:bg-gray-200 rounded-full" />
                            
                        </div>
                        <div className="inline-flex gap-x-2 items-center cursor-pointer">
                            <ConfirmDelete onConfirm={() => deleteExecutorAsync(index)} />
                        </div>
                        </div>
                    </div>
                </div>
                ))}
                <AddButton onClick={addExecutorItem} label={`EXECUTOR ${formState.length}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton onClick={handleNextClick} />
            </div>
            <Modal
                className='flex flex-col justify-center w-full items-center'
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <div className='bg-white p-6 max-w-lg flex flex-col w-full'>
                    <p className='pb-4'>Executor</p>
                    <ExecutorForm index={currentItem - 1} />
                    <CustomButton label='Save Executor' onClick={() => handleSaveExecutorAsync(currentItem - 1)} />
                </div>
            </Modal>
        </div>
    )
}

export default ExecutorPage;  
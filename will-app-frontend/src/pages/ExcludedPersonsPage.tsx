import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { deleteExcludedPerson, upsertExcludedPerson } from '../api/excludedPerson';
import { userState } from '../atoms/UserDetailsState';
import { emptyExcludedPersonValidationState, excludedPersonsValidationState, IExcludedPersonValidationState } from '../atoms/validationStates/ExcludedPersonsValidationState';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import ConfirmDelete from "../components/ConfirmDelete";
import CustomAccordion from '../components/CustomAccordion';
import ExcludedPersonForm from '../components/Forms/ExcludedPersonForm';
import NextButton from '../components/NextButton';
import { ROUTE_PATHS } from '../constants';
import { IExcludedPerson, IExcludedPersonDeleteRequest } from '../models/excludedPerson';
import { IsEmptyString } from '../utils';
import { excludedPersonsState, IExcludedPersonState } from '../atoms/ExcludedPersonsState';

const ExcludedPersonsPage = () => {
    const [formState, setFormState] = useRecoilState<IExcludedPersonState[]>(excludedPersonsState);
    const [validationState, setValidationState] = useRecoilState<IExcludedPersonValidationState[]>(excludedPersonsValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const saveExcludedPersonAsync = async (property: IExcludedPersonState, index: number) => {
        let data: IExcludedPerson = {
            id: property.id,
            userId: user.userId,
            data: property
        }
        let upsertedExecutor = await upsertExcludedPerson(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedExecutor.data, id: upsertedExecutor.id } : item))
        );
    }


    const deleteExcludedPersonAsync = async (index: number) => {
        if (formState[index].id !== ""
            && formState[index].id !== undefined
        ) {
            let data: IExcludedPersonDeleteRequest = {
                id: formState[index].id,
                userId: user.userId
            }
            await deleteExcludedPerson(data);
        }

        setFormState((prevItems) =>
            prevItems.filter((_, i) => i !== index)
        );

        setValidationState((prevItems) =>
            prevItems.filter((_, i) => i !== index)
        );
    };

    const setExcludedPersonValidationState = (index: number, key: keyof IExcludedPersonValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        var isValid: boolean = true;
        formState.forEach((asset, index) => {
            if (IsEmptyString(asset.fullName)) {
                setExcludedPersonValidationState(index, "fullName", "Full name is required");
                isValid = false;
            }
            if (IsEmptyString(asset.relationship)) {
                setExcludedPersonValidationState(index, "relationship", "relationship is required");
                isValid = false;
            }
            if (IsEmptyString(asset.reason)) {
                setExcludedPersonValidationState(index, "reason", "reason is required");
                isValid = false;
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    };

    const handleNextClick = async () => {
        if (!validate()) return;

        formState.forEach(async (person, index) => {
            await saveExcludedPersonAsync(person, index);
        });

        navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.EXECUTOR);
    };

    const addDigitalAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                fullName: "",
                relationship: "",
                reason: ""
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyExcludedPersonValidationState
        ]);
        setCurrentItem(formState.length);
    };

    const getSubTitle = (index: number) => {
        const { fullName, relationship } = formState[index];
        return [fullName?.trim(), relationship?.trim()].filter(Boolean).join(" - ");
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
            <h1 className='text-2xl font-semibold'>Excluded Persons</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`Person ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <ExcludedPersonForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <ConfirmDelete onConfirm={() => deleteExcludedPersonAsync(index)} />
                                )
                            }

                        </div>
                    ))
                }
                <AddButton onClick={addDigitalAsset} label={`Person ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    );
};

export default ExcludedPersonsPage;

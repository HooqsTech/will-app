import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { deleteAsset, upsertAsset } from '../api/asset';
import { IPetState, petsState } from '../atoms/petsState';
import { routesState } from '../atoms/RouteState';
import { userState } from '../atoms/UserDetailsState';
import { emptyPetValidationState, IPetValidationState, petsValidationState } from '../atoms/validationStates/PetsValidationState';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import ConfirmDelete from "../components/ConfirmDelete";
import CustomAccordion from '../components/CustomAccordion';
import PetForm from '../components/Forms/PetsForm';
import NextButton from '../components/NextButton';
import { ASSET_SUBTYPES, ASSET_TYPES, ROUTE_PATHS } from '../constants';
import { IAsset } from '../models/asset';
import { IsEmptyString } from '../utils';

const PetsPage = () => {
    const [formState, setFormState] = useRecoilState<IPetState[]>(petsState);
    const [validationState, setValidationState] = useRecoilState<IPetValidationState[]>(petsValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const savePetAsync = async (property: IPetState, index: number) => {
        var data: IAsset = {
            id: property.id,
            type: ASSET_TYPES.OTHER_ASSETS,
            subtype: ASSET_SUBTYPES.PETS,
            userId: user.userId,
            data: property
        }
        var upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    }

    const deletePropertyAsync = async (index: number) => {
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

    const setPropertyValidationState = (index: number, key: keyof IPetValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        var isValid: boolean = true;
        formState.forEach((prop, index) => {
            if (IsEmptyString(prop.petName)) {
                setPropertyValidationState(index, "petName", "pet name is required");
                isValid = false;
            }

            if (IsEmptyString(prop.animalBreed)) {
                setPropertyValidationState(index, "animalBreed", "animal / breed is required");
                isValid = false;
            }

            if (IsEmptyString(prop.amount)) {
                setPropertyValidationState(index, "amount", "amount is required");
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
        formState.forEach(async (pet, index) => {
            await savePetAsync(pet, index);
        })

        // NAVIGATE TO NEXT ROUTE
        var routeValue = routeState.find(s => location.pathname.includes(s.currentPath));
        navigate(ROUTE_PATHS.YOUR_WILL + (routeValue?.nextPath ?? ROUTE_PATHS.LIABILITIES));
    }

    const addProperty = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                petName: "",
                animalBreed: "",
                amount: ""
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyPetValidationState
        ])
        setCurrentItem(formState.length);
    };

    const getSubTitle = (index: number) => {
        const { petName, animalBreed } = formState[index];
        const firstLine = petName?.trim() || "";
        const secondLine = [animalBreed?.trim()];
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
            <h1 className='text-2xl font-semibold'>Pets</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`Pets ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <PetForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <ConfirmDelete onConfirm={() => deletePropertyAsync(index)} />
                                )
                            }

                        </div>
                    ))
                }
                <AddButton onClick={addProperty} label={`Pet ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    )
}

export default PetsPage   
import { useRecoilState, useRecoilValue } from 'recoil';
import CustomButton from '../components/CustomButton';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import VehicleForm from '../components/Forms/VehicleForm';
import { IVehicleState, vehiclesState } from '../atoms/VehiclesState';
import { userState } from '../atoms/UserDetailsState';
import { IsEmptyString } from '../utils';
import { emptyVehicleValidationState, IVehicleValidationState, vehiclesValidationState } from '../atoms/validationStates/VehicleValidationState';
import { upsertAsset, deleteAsset } from '../api/asset';
import { ASSET_TYPES, ASSET_SUBTYPES } from '../constants';
import DeleteIcon from '@mui/icons-material/Delete';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import { routesState } from '../atoms/RouteState';
import { useLocation, useNavigate } from 'react-router';

const Vehicles = () => {
    const [formState, setFormState] = useRecoilState<IVehicleState[]>(vehiclesState);
    const [validationState, setValidationState] = useRecoilState<IVehicleValidationState[]>(vehiclesValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const [showErrorBorder, setShowErrorBorder] = useState(false);
    const user = useRecoilValue(userState);
    const routeState = useRecoilValue(routesState);
    const navigate = useNavigate();
    const location = useLocation();

    const shouldExpandAccordion = (index: number) => {
        return currentItem === index
    }

    const addItem = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                brandOrModel: "",
                registrationNumber: ""
            },
        ]);
        setValidationState((prevState) => [...prevState, emptyVehicleValidationState]);
        setCurrentItem(formState.length);
    };

    const saveVehicleAsync = async (vehicle: IVehicleState, index: number) => {
        const data = {
            id: vehicle.id,
            type: ASSET_TYPES.PHYSICAL_ASSETS,
            subtype: ASSET_SUBTYPES.VEHICLES,
            userId: user.userId,
            data: vehicle
        };
        const upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    };

    const deleteVehicleAsync = async (index: number) => {
        const isDeleted = await deleteAsset(formState[index].id);
        if (isDeleted) {
            setFormState((prevItems) => prevItems.filter((_, i) => i !== index));
            setValidationState((prevValidations) => prevValidations.filter((_, i) => i !== index));
        }
    };

    const setVehicleValidationState = (index: number, key: keyof IVehicleValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        let isValid = true;
        formState.forEach((vehicle, index) => {
            if (IsEmptyString(vehicle.brandOrModel)) {
                setVehicleValidationState(index, "brandOrModel", "Brand/Model is required");
                isValid = false;
            }
            if (IsEmptyString(vehicle.registrationNumber)) {
                setVehicleValidationState(index, "registrationNumber", "Registration Number is required");
                isValid = false;
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    };

    const handleNextClick = async () => {
        if (!validate()) return;
        formState.forEach(async (vehicle, index) => {
            await saveVehicleAsync(vehicle, index);
        });
    };

    const handleBackClick = async () => {
        // NAVIGATE TO PREVIOUS ROUTE
        var routeValue = routeState.find(s => s.nextPath == location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    }

    const handleAccordionOnChange = (index: number) => {
        setCurrentItem((prevItem) => (prevItem === index ? -1 : index));
        setShowErrorBorder(false);
    };

    const getSubTitle = (index: number) => {
        const { brandOrModel, registrationNumber } = formState[index];
        const firstLine = brandOrModel?.trim() || "";
        const secondLine = registrationNumber?.trim() || "";
        return [firstLine, secondLine].filter(Boolean).join("\n");
    };

    return (
        <div className='flex flex-col justify-start h-full space-y-3 w-xl m-auto'>
            <h1 className='text-2xl font-semibold'>Properties</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`Vehicles ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <VehicleForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <button onClick={() => deleteVehicleAsync(index)} className='p-2 h-full bg-will-green'>
                                        <DeleteIcon fontSize="small" className='text-white bg-will-green' />
                                    </button>
                                )
                            }

                        </div>
                    ))
                }
                <AddButton onClick={addItem} label={`Vehicles ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton label='Next' onClick={handleNextClick} />
            </div>
        </div>
    );
};

export default Vehicles;
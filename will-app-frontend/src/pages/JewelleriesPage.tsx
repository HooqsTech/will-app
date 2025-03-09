import { IJewelleryState, jewelleriesState } from '../atoms/JewelleriesState';
import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import JewelleryForm from '../components/Forms/JewelleryForm';
import { useState } from 'react';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import { routesState } from '../atoms/RouteState';
import { useLocation, useNavigate } from 'react-router';
import { IAsset } from '../models/asset';
import { deleteAsset, upsertAsset } from '../api/asset';
import { userState } from '../atoms/UserDetailsState';
import { ASSET_SUBTYPES, ASSET_TYPES, ROUTE_PATHS } from '../constants';
import { emptyJewelleryValidationState, IJewelleriesValidationState, jewelleriesValidationState } from '../atoms/validationStates/JewelleriesValidationState';
import { IsEmptyString } from '../utils';
import DeleteIcon from '@mui/icons-material/Delete';

const JewelleriesPage = () => {
    const [formState, setFormState] = useRecoilState<IJewelleryState[]>(jewelleriesState);
    const [validationState, setValidationState] = useRecoilState<IJewelleriesValidationState[]>(jewelleriesValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const saveJewelleryAsync = async (jewellery: IJewelleryState, index: number) => {
        var data: IAsset = {
            id: jewellery.id,
            type: ASSET_TYPES.OTHER_ASSETS,
            subtype: ASSET_SUBTYPES.JEWELLERIES,
            userId: user.userId,
            data: jewellery
        };
        var upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    }

    const deleteJewelleryAsync = async (index: number) => {
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
        var routeValue = routeState.find(s => s.nextPath == location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    };

    const setJewelleryValidationState = (index: number, key: keyof IJewelleriesValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        var isValid: boolean = true;
        formState.forEach((jewel, index) => {
            if (IsEmptyString(jewel.type)) {
                setJewelleryValidationState(index, "type", "Jewellery type is required");
                isValid = false;
            }

            if (IsEmptyString(jewel.description)) {
                setJewelleryValidationState(index, "description", "description is required");
                isValid = false;
            }

            if (IsEmptyString(jewel.preciousMetalInWeight)) {
                setJewelleryValidationState(index, "preciousMetalInWeight", "Weight is required");
                isValid = false;
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    };

    const handleNextClick = async () => {
        if (!validate()) return;

        formState.forEach(async (jewellery, index) => {
            await saveJewelleryAsync(jewellery, index);
        });

        let routeValue = routeState.find(s => location.pathname.includes(s.currentPath));
        navigate(ROUTE_PATHS.YOUR_WILL + (routeValue?.nextPath ?? ROUTE_PATHS.LIABILITIES));
    };

    const addJewellery = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                type: "",
                description: "",
                preciousMetalInWeight: ""
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyJewelleryValidationState
        ]);
        setCurrentItem(formState.length);
    };

    const getSubTitle = (index: number) => {
        return formState[index].description?.trim() || "";
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
            <h1 className='text-2xl font-semibold'>Jewelleries</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`Jewellery ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <JewelleryForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <button onClick={() => deleteJewelleryAsync(index)} className='p-2 h-full bg-will-green'>
                                        <DeleteIcon fontSize="small" className='text-white bg-will-green' />
                                    </button>
                                )
                            }
                        </div>
                    ))
                }
                <AddButton onClick={addJewellery} label={`Jewellery ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    );
};

export default JewelleriesPage;
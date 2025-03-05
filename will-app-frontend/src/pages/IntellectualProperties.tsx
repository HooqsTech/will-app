import { useRecoilState, useRecoilValue } from 'recoil';
import { useState } from 'react';
import CustomAccordion from '../components/CustomAccordion';
import IntellectualPropertyForm from '../components/Forms/IntellectualPropertyForm';
import { intellectualPropertiesState, IIntellectualPropertyState } from '../atoms/IntellectualPropertiesState';
import { userState } from '../atoms/UserDetailsState';
import { emptyIntellectualPropertyValidationState, intellectualPropertyValidationState, IIntellectualPropertyValidationState } from '../atoms/validationStates/IntellectualPropertiesValidationState';
import { IsEmptyString } from '../utils';
import { upsertAsset, deleteAsset } from '../api/asset';
import { ASSET_TYPES, ASSET_SUBTYPES } from '../constants';
import DeleteIcon from '@mui/icons-material/Delete';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import AddButton from '../components/AddButton';
import { routesState } from '../atoms/RouteState';
import { useLocation, useNavigate } from 'react-router';

const IntellectualProperties = () => {
    const [formState, setFormState] = useRecoilState<IIntellectualPropertyState[]>(intellectualPropertiesState);
    const [validationState, setValidationState] = useRecoilState<IIntellectualPropertyValidationState[]>(intellectualPropertyValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const [showErrorBorder, setShowErrorBorder] = useState(false);
    const user = useRecoilValue(userState);
    const routeState = useRecoilValue(routesState);
    const navigate = useNavigate();
    const location = useLocation();

    const addProperty = () => {
        setFormState((prevState) => [...prevState, {
            id: "",
            type: "",
            identificationNumber: "",
            description: ""
        }]);
        setValidationState((prevState) => [...prevState, emptyIntellectualPropertyValidationState]);
        setCurrentItem(formState.length);
    };

    const handleBackClick = async () => {
        var routeValue = routeState.find(s => s.nextPath == location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    };

    const savePropertyAsync = async (property: IIntellectualPropertyState, index: number) => {
        const data = {
            id: property.id,
            type: ASSET_TYPES.OTHER_INVESTMENTS,
            subtype: ASSET_SUBTYPES.INTELLECTUAL_PROPERTY,
            userId: user.userId,
            data: property
        };
        const upsertedAsset = await upsertAsset(data);
        
        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    };

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
    };

    const setPropertyValidationState = (index: number, key: keyof IIntellectualPropertyValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        let isValid = true;
        formState.forEach((property, index) => {
            if (IsEmptyString(property.type)) {
                setPropertyValidationState(index, "type", "Type is required");
                isValid = false;
            }
            if (IsEmptyString(property.identificationNumber)) {
                setPropertyValidationState(index, "identificationNumber", "Identification Number is required");
                isValid = false;
            }
            if (IsEmptyString(property.description)) {
                setPropertyValidationState(index, "description", "Description is required");
                isValid = false;
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    };

    const getSubTitle = (index: number) => {
        const { type, identificationNumber, description } = formState[index];
        const firstLine = type?.trim() || "";
        const secondLine = [identificationNumber?.trim(), description?.trim()].filter(Boolean).join(" - ");
        return [firstLine, secondLine].filter(Boolean).join("\n");
    };

    const handleNextClick = async () => {
        if (!validate()) return;
        formState.forEach(async (property, index) => {
            await savePropertyAsync(property, index);
        });
    };

    const shouldExpandAccordion = (index: number) => currentItem === index;
    
    const handleAccordionOnChange = (index: number) => {
        setCurrentItem((prevItem) => prevItem === index ? -1 : index);
        setShowErrorBorder(false);
    };

    return (
        <div className='flex flex-col justify-start h-full space-y-3 w-xl m-auto'>
            <h1 className='text-2xl font-semibold'>Intellectual Properties</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`Intellectual Property ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <IntellectualPropertyForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <button onClick={() => deletePropertyAsync(index)} className='p-2 h-full bg-will-green'>
                                        <DeleteIcon fontSize="small" className='text-white bg-will-green' />
                                    </button>
                                )
                            }

                        </div>
                    ))
                }
                <AddButton onClick={addProperty} label={`Intellectual Property ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton label='Next' onClick={handleNextClick} />
            </div>
        </div>
    );
};

export default IntellectualProperties;

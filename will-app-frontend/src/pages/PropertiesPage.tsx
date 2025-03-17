import { IPropertiesState, propertiesState } from '../atoms/PropertiesState';
import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import PropertiesForm from '../components/Forms/PropertiesForm';
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
import { emptyPropertyValidationState, IPropertiesValidationState, propertiesValidationState } from '../atoms/validationStates/PropertiesValidationState';
import { IsEmptyString } from '../utils';
import ConfirmDelete from "../components/ConfirmDelete";

const PropertiesPage = () => {
    const [formState, setFormState] = useRecoilState<IPropertiesState[]>(propertiesState);
    const [validationState, setValidationState] = useRecoilState<IPropertiesValidationState[]>(propertiesValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const savePropertyAsync = async (property: IPropertiesState, index: number) => {
        var data: IAsset = {
            id: property.id,
            type: ASSET_TYPES.IMMOVABLE_ASSETS,
            subtype: ASSET_SUBTYPES.PROPERTIES,
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

    const handleBackClick = async () => {
        // NAVIGATE TO PREVIOUS ROUTE
        var routeValue = routeState.find(s => s.nextPath == location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    }

    const setPropertyValidationState = (index: number, key: keyof IPropertiesValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        var isValid: boolean = true;
        formState.forEach((prop, index) => {
            if (IsEmptyString(prop.propertyType)) {
                setPropertyValidationState(index, "propertyType", "property type is required");
                isValid = false;
            }

            if (IsEmptyString(prop.ownershipType)) {
                setPropertyValidationState(index, "ownershipType", "ownership type is required");
                isValid = false;
            }

            if (IsEmptyString(prop.address)) {
                setPropertyValidationState(index, "address", "address is required");
                isValid = false;
            }

            if (IsEmptyString(prop.pincode)) {
                setPropertyValidationState(index, "pincode", "pincode is required");
                isValid = false;
            }

            if (IsEmptyString(prop.city)) {
                setPropertyValidationState(index, "city", "city is required");
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

    const addProperty = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                propertyType: "",
                ownershipType: "",
                address: "",
                pincode: "",
                city: "",
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyPropertyValidationState
        ])
        setCurrentItem(formState.length);
    };

    const getSubTitle = (index: number) => {
        const { address, pincode, city } = formState[index];
        const firstLine = address?.trim() || "";
        const secondLine = [city?.trim(), pincode?.trim()].filter(Boolean).join(" - ");
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
            <h1 className='text-2xl font-semibold'>Properties</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`Property ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <PropertiesForm index={index} />
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
                <AddButton onClick={addProperty} label={`Property ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    )
}

export default PropertiesPage   
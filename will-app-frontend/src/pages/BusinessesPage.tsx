
import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { businessesState, IBusinessState } from '../atoms/BusinessesState';
import BusinessForm from '../components/Forms/BusinessForm';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import { useLocation, useNavigate } from 'react-router';
import { routesState } from '../atoms/RouteState';
import { deleteAsset, upsertAsset } from '../api/asset';
import { ASSET_SUBTYPES, ASSET_TYPES, ROUTE_PATHS } from '../constants';
import { IAsset } from '../models/asset';
import { userState } from '../atoms/UserDetailsState';
import { IsEmptyString, IsValidPan } from '../utils';
import ConfirmDelete from "../components/ConfirmDelete";
import { businessesValidationState, emptyBusinessesValidationState, IBusinessValidationState } from '../atoms/validationStates/BusinessesValidationState';
import Swal from 'sweetalert2';

const BusinessesPage = () => {
    const [formState, setFormState] = useRecoilState<IBusinessState[]>(businessesState);
    const [validationState, setValidationState] = useRecoilState<IBusinessValidationState[]>(businessesValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const saveBusinessesAsync = async (property: IBusinessState, index: number) => {
        let data: IAsset = {
            id: "",
            type: ASSET_TYPES.BUSINESS_ASSETS,
            subtype: ASSET_SUBTYPES.BUSINESSES,
            userId: user.userId,
            data: property
        }
        let upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    }

    const deleteBusinessesAsync = async (index: number) => {
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

    const setPropertyValidationState = (index: number, key: keyof IBusinessValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        let isValid: boolean = true;
        formState.forEach((prop, index) => {
            if (IsEmptyString(prop.type)) {
                setPropertyValidationState(index, "type", "Type is required");
                isValid = false;
            }
            if (IsEmptyString(prop.companyName)) {
                setPropertyValidationState(index, "companyName", "Company name is required");
                isValid = false;
            }
            if (prop.type === "Private Limited") {
                if (IsEmptyString(prop.natureOfHolding)) {
                    setPropertyValidationState(index, "natureOfHolding", "nature of holding is required");
                    isValid = false;
                }
            }
            if (IsEmptyString(prop.address)) {
                setPropertyValidationState(index, "address", "Address is required");
                isValid = false;
            }
            if (IsEmptyString(prop.holdingPercentage)) {
                setPropertyValidationState(index, "holdingPercentage", "Holding Percentage is required");
                isValid = false;
            }
            if (IsEmptyString(prop.pan)) {
                setPropertyValidationState(index, "pan", "Pan is required");
                isValid = false;
            }
            if (!IsValidPan(prop.pan)) {
                setPropertyValidationState(index, "pan", "Pan is invalid");
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
            await saveBusinessesAsync(property, index);
        })

        // NAVIGATE TO NEXT ROUTE
        let routeValue = routeState.find(s => location.pathname.includes(s.currentPath));
        if (!routeValue?.nextPath) {
            Swal.fire({
                title: "Are you sure Proceed to Liabilities",
                text: "Ready to move to Liabilities Section? Click No to add more Assets",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "var(--color-will-green)",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, go to Liabilities",
                cancelButtonText: "No",
                customClass: {
                    popup: "swal-sm",
                    title: "swal-title",
                    confirmButton: "swal-confirm-btn",
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.LIABILITIES);
                }
                else {
                    navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.ASSETS)
                }
            });
        } else {
            navigate(ROUTE_PATHS.YOUR_WILL + routeValue.nextPath);
        }
    }

    const addBusinessesAsync = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                type: "",
                companyName: "",
                address: "",
                holdingPercentage: "",
                partnership: "",
                pan: "",
                natureOfHolding: "",
                typeOfSecurity: ""
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyBusinessesValidationState
        ])
        setCurrentItem(formState.length);
    };

    const getSubTitle = (index: number) => {
        const { type, companyName, address, holdingPercentage } = formState[index];
        const firstLine = [type?.trim(), holdingPercentage?.trim()].filter(Boolean).join(" - ");
        const secondLine = [companyName?.trim(), address?.trim()].filter(Boolean).join(" - ");
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
            <h1 className='text-2xl font-semibold capitalize'>Businesses</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`BUSINESS ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <BusinessForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <ConfirmDelete onConfirm={() => deleteBusinessesAsync(index)} />
                                )
                            }

                        </div>
                    ))
                }
                <AddButton onClick={addBusinessesAsync} label={`BUSINESS ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' />
                <NextButton onClick={handleNextClick} />
            </div>
        </div>
    )
}

export default BusinessesPage;   
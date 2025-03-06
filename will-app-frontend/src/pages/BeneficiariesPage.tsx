import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { beneficiariesState, IBeneficiaryState } from '../atoms/BeneficiariesState';
import BeneficiaryForm from '../components/Forms/BeneficiaryForm';
import { IBeneficiary, IBeneficiaryDeleteRequest } from '../models/beneficiary';
import { deleteBeneficiary, upsertBeneficiary } from '../api/beneficiary';
import { routesState } from '../atoms/RouteState';
import { userState } from '../atoms/UserDetailsState';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import { BENEFICIARIES } from '../constants';
import { IsEmptyNumber, IsEmptyString } from '../utils';
import { beneficiariesValidationState, emptyBeneficiariesValidationState, IBeneficiaryValidationState } from '../atoms/validationStates/BeneficiariesValidationState';
import { useLocation, useNavigate } from 'react-router';
import DeleteIcon from '@mui/icons-material/Delete';

const BeneficiariesPage = () => {
    const [formState, setFormState] = useRecoilState<IBeneficiaryState[]>(beneficiariesState);
    const [validationState, setValidationState] = useRecoilState<IBeneficiaryValidationState[]>(beneficiariesValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const [showErrorBorder, setShowErrorBorder] = useState(false);
    const user = useRecoilValue(userState);
    const routeState = useRecoilValue(routesState);
    const navigate = useNavigate();
    const location = useLocation();

    const saveBeneficiaryAsync = async (property: IBeneficiaryState,index: number) => {
            let data: IBeneficiary = {
                id: "",
                type: BENEFICIARIES,
                subtype: "",
                userId: user.userId,
                data: property
            }
            let upsertedBeneficiary = await upsertBeneficiary(data);
    
            setFormState((prevItems) =>
                prevItems.map((item, i) => (i === index ? { ...upsertedBeneficiary.data, id: upsertedBeneficiary.id } : item))
            );
        }
    
    const deleteBeneficiaryAsync = async (index: number) => {
        let data: IBeneficiaryDeleteRequest = {
            id: "",
            userId: user.userId
        }
            let isDeleted = await deleteBeneficiary(data);
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
            
    const setPropertyValidationState = (index: number, key: keyof IBeneficiaryValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

     const validate = () => {
        let isValid: boolean = true;
        formState.forEach((prop, index) => {
            if (IsEmptyString(prop.type)) {
                setPropertyValidationState(index, "type", "Beneficiary Type is required");
                isValid = false;
            }
            if (prop.type == "Person" && IsEmptyString(prop.fullName)) {
                setPropertyValidationState(index, "fullName", "Name is required");
                isValid = false;
            }
            if (prop.type == "Person" && IsEmptyString(prop.gender)) {
                setPropertyValidationState(index, "gender", "Gender is required");
                isValid = false;
            }
            if (prop.type == "Person" && IsEmptyString(prop.dateOfBirth)) {
                setPropertyValidationState(index, "dateOfBirth", "DOB is required");
                isValid = false;
            }
            if (prop.type == "Person" && IsEmptyString(prop.email)) {
                setPropertyValidationState(index, "email", "Email is required");
                isValid = false;
            }
            if (prop.type == "Person" && IsEmptyString(prop.phone)) {
                setPropertyValidationState(index, "phone", "Phone is required");
                isValid = false;
            }
            if (prop.type == "Person" && IsEmptyString(prop.relationship)) {
                setPropertyValidationState(index, "relationship", "Relationship is required");
                isValid = false;
            }
            if (prop.type == "Charity" && IsEmptyString(prop.charityType)) {
                setPropertyValidationState(index, "charityType", "Charity Type is required");
                isValid = false;
            }
            if (prop.type == "Charity" && IsEmptyString(prop.organization)) {
                setPropertyValidationState(index, "organization", "Organization is required");
                isValid = false;
            }
            if ( prop.type == "Charity" && IsEmptyNumber(prop.donationAmount)) {
                setPropertyValidationState(index, "donationAmount", "Donation Amount is required");
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
            await saveBeneficiaryAsync(property, index);
        })

        // NAVIGATE TO NEXT ROUTE
        let routeValue = routeState.find(s => s.currentPath == location.pathname);
        navigate(routeValue?.nextPath ?? "/");
    }
    const addBeneficiaryItem = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                type: "",
                fullName: "",
                gender: "",
                dateOfBirth: "",
                email: "",
                phone: "",
                relationship: "",
                charityType: "",
                organization: "",
                otherOrganization: "",
                donationAmount: null,
            },
        ]);
        setValidationState((prevState) => [
                                    ...prevState,
                                    emptyBeneficiariesValidationState
                                ])
        setCurrentItem(formState.length)
    };

    const getSubTitle = (index: number) => {
        const { type, fullName, email,relationship,charityType, organization } = formState[index];
        if(type == "Person")
        {
            let firstLine = [type?.trim(), fullName.trim()].filter(Boolean).join(" - ");
            let secondLine = [relationship?.trim(), email?.trim()].filter(Boolean).join(" - ");
            return [firstLine, secondLine].filter(Boolean).join("\n");
        }
        else {
            let firstLine = [type?.trim()].filter(Boolean).join(" - ");
            let secondLine = [charityType?.trim(),organization?.trim()].filter(Boolean).join(" - ");
            return [firstLine, secondLine].filter(Boolean).join("\n");
        }
        
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
            <h1 className='text-2xl font-semibold'>BENEFICIARIES</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`BENEFICIARIY ${index + 1}`}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <BeneficiaryForm index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <button onClick={() => deleteBeneficiaryAsync(index)} className='p-2 h-full bg-will-green'>
                                        <DeleteIcon fontSize="small" className='text-white bg-will-green' />
                                    </button>
                                )
                            }

                        </div>
                    ))
                }
                <AddButton onClick={addBeneficiaryItem} label={`BENEFICIARIY ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton label='Next' onClick={handleNextClick} />
            </div>
        </div>
    )
}

export default BeneficiariesPage;   
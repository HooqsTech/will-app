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
import { BENEFICIARIES, ROUTE_PATHS } from '../constants';
import { IsEmptyNumber, IsEmptyString, isValidAadhaar, IsValidEmail, IsValidPhoneNumber } from '../utils';
import { beneficiariesValidationState, emptyBeneficiariesValidationState, IBeneficiaryValidationState } from '../atoms/validationStates/BeneficiariesValidationState';
import { useLocation, useNavigate } from 'react-router';
import ConfirmDelete from "../components/ConfirmDelete";
import { Modal } from '@mui/material';
import { guardianModalState } from '../atoms/GuardianModelState';
import CustomButton from '../components/CustomButton';
import dayjs from 'dayjs';

const BeneficiariesPage = () => {
    const [formState, setFormState] = useRecoilState<IBeneficiaryState[]>(beneficiariesState);
    const [validationState, setValidationState] = useRecoilState<IBeneficiaryValidationState[]>(beneficiariesValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const [showErrorBorder, setShowErrorBorder] = useState(false);
    const user = useRecoilValue(userState);
    const routeState = useRecoilValue(routesState);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useRecoilState(guardianModalState);

    const saveBeneficiaryAsync = async (property: IBeneficiaryState, index: number) => {
        let data: IBeneficiary = {
            id: property.id,
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
        if (formState[index].id !== ""
            && formState[index].id !== undefined
        ) {
            let data: IBeneficiaryDeleteRequest = {
                id: formState[index].id,
                userId: user.userId
            }
            await deleteBeneficiary(data);
        }

        setFormState((prevItems) =>
            prevItems.filter((_, i) => i !== index)
        );

        setValidationState((prevItems) =>
            prevItems.filter((_, i) => i !== index)
        );
    }

    const setBeneficiaryValidationState = (index: number, key: keyof IBeneficiaryValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validateAll = () => {
        let isValid: boolean = true;
        formState.forEach((_, index) => {
            isValid = validate(index);
        });
        setShowErrorBorder(!isValid);
        return isValid;
    }

    const validate = (index: number) => {
        let isValid: boolean = true;
        var prop = formState[index];
        var age = dayjs().diff(dayjs(formState[index].dateOfBirth), "year");

        if (IsEmptyString(prop.type)) {
            setBeneficiaryValidationState(index, "type", "Beneficiary Type is required");
            isValid = false;
        }
        if (prop.type === "Person") {
            if (IsEmptyString(prop.fullName)) {
                setBeneficiaryValidationState(index, "fullName", "name is required");
                isValid = false;
            }
            if (IsEmptyString(prop.gender)) {
                setBeneficiaryValidationState(index, "gender", "gender is required");
                isValid = false;
            }
            if (IsEmptyString(prop.dateOfBirth)) {
                setBeneficiaryValidationState(index, "dateOfBirth", "dob is required");
                isValid = false;
            }
            if (prop.dateOfBirth !== "" && age <= 18 && prop.isGuardian) {
                setBeneficiaryValidationState(index, "dateOfBirth", "guardian age must be greater than 18");
                isValid = false;
            }
            if (prop.dateOfBirth !== "" && age <= 18 && IsEmptyString(prop.guardian) && !prop.isGuardian) {
                setBeneficiaryValidationState(index, "guardian", "guardian is required");
                isValid = false;
            }
            if (IsEmptyString(prop.email)) {
                setBeneficiaryValidationState(index, "email", "email is required");
                isValid = false;
            }
            if (!IsValidEmail(prop.email)) {
                setBeneficiaryValidationState(index, "email", "invalid email address");
                isValid = false;
            }
            if (IsEmptyString(prop.phone)) {
                setBeneficiaryValidationState(index, "phone", "phone is required");
                isValid = false;
            }
            if (!IsValidPhoneNumber(prop.phone)) {
                setBeneficiaryValidationState(index, "phone", "phone is invalid");
                isValid = false;
            }
            if (IsEmptyString(prop.aadhaarNumber)) {
                setBeneficiaryValidationState(index, "aadhaarNumber", "aadhaar number is required");
                isValid = false;
            }
            if (!isValidAadhaar(prop.aadhaarNumber)) {
                setBeneficiaryValidationState(index, "aadhaarNumber", "aadhaar number is invalid");
                isValid = false;
            }
            if (IsEmptyString(prop.relationship)) {
                setBeneficiaryValidationState(index, "relationship", "relationship is required");
                isValid = false;
            }
            if(formState.filter(s => s.aadhaarNumber == prop.aadhaarNumber).length > 1){
                setBeneficiaryValidationState(index, "aadhaarNumber", "aadhaar number is already exist");
                isValid = false;
            }
        }
        if (prop.type === "Charity") {
            if (IsEmptyString(prop.charityType)) {
                setBeneficiaryValidationState(index, "charityType", "charity type is required");
                isValid = false;
            }
            if (IsEmptyString(prop.organization)) {
                setBeneficiaryValidationState(index, "organization", "organization is required");
                isValid = false;
            }
            if (IsEmptyNumber(prop.donationAmount)) {
                setBeneficiaryValidationState(index, "donationAmount", "donation amount is required");
                isValid = false;
            }
        }
        setShowErrorBorder(!isValid);
        return isValid;
    }

    const handleNextClick = async () => {
        // VALIDATE
        if (!validateAll()) return;

        // SAVE PROPERTIES
        formState.forEach(async (property, index) => {
            await saveBeneficiaryAsync(property, index);
        })

        // NAVIGATE TO NEXT ROUTE
        routeState.find(s => s.currentPath == location.pathname);
        navigate(ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.ASSET_DISTRIBUTION);
    }

    const saveGuardianAsync = async (index: number) => {
        // VALIDATE
        if (!validate(index)) return;

        await saveBeneficiaryAsync(formState[index], index);

        setIsOpen(false);
    }

    const addGuardian = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                type: "Person",
                fullName: "",
                gender: "",
                dateOfBirth: "",
                email: "",
                phone: "",
                relationship: "",
                charityType: "",
                organization: "",
                aadhaarNumber: "",
                otherOrganization: "",
                donationAmount: null,
                isGuardian: true
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyBeneficiariesValidationState
        ])
        setIsOpen(true);
    }

    const addBeneficiaryItem = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                type: "",
                fullName: "",
                aadhaarNumber: "",
                gender: "",
                dateOfBirth: "",
                email: "",
                phone: "",
                relationship: "",
                charityType: "",
                organization: "",
                otherOrganization: "",
                donationAmount: null,
                isGuardian: false
            },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyBeneficiariesValidationState
        ])
        setCurrentItem(formState.length)
    };

    const removeGuardian = () => {
        var newState = formState.slice(0, formState.length - 1);
        setFormState(newState);
    }

    const getSubTitle = (index: number) => {
        const { type, fullName, email, relationship, charityType, organization } = formState[index];
        if (type == "Person") {
            let firstLine = [type?.trim(), fullName.trim()].filter(Boolean).join(" - ");
            let secondLine = [relationship?.trim(), email?.trim()].filter(Boolean).join(" - ");
            return [firstLine, secondLine].filter(Boolean).join("\n");
        }
        else {
            let firstLine = [type?.trim()].filter(Boolean).join(" - ");
            let secondLine = [charityType?.trim(), organization?.trim()].filter(Boolean).join(" - ");
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
            <h1 className='text-2xl font-semibold'>Beneficiaries</h1>
            <div>
                {
                    formState.map((_, index) => (
                        <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                            <div className='w-full h-full'>
                                <CustomAccordion key={index} expanded={shouldExpandAccordion(index)}
                                    error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                    onChange={() => handleAccordionOnChange(index)}
                                    label={`BENEFICIARY ${index + 1}`}
                                    showShield={formState[index].isGuardian}
                                    subTitle={
                                        currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""
                                    }
                                >
                                    <BeneficiaryForm addGuardian={addGuardian} index={index} />
                                </CustomAccordion>
                            </div>
                            {
                                !shouldExpandAccordion(index) && (
                                    <ConfirmDelete onConfirm={() => deleteBeneficiaryAsync(index)} />
                                )
                            }
                        </div>
                    ))
                }
                <AddButton onClick={addBeneficiaryItem} label={`BENEFICIARY ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' />
                <NextButton onClick={handleNextClick} />
            </div>
            <Modal
                className='flex flex-col justify-center w-full items-center'
                open={isOpen}
                onClose={() => { setIsOpen(false); removeGuardian() }}
            >
                <div className='bg-white p-6 max-w-lg flex flex-col w-full'>
                    <p className='pb-4'>Add Guardian</p>
                    <BeneficiaryForm isGuardian index={formState.length - 1} />
                    <CustomButton label='Save Guardian' onClick={() => saveGuardianAsync(formState.length - 1)} />
                </div>
            </Modal>
        </div >
    )
}

export default BeneficiariesPage;   
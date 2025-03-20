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
import ConfirmDelete from "../components/ConfirmDelete";
import DeleteIcon from '@mui/icons-material/Delete';
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

    const validateAll = () => {
        let isValid: boolean = true;
        formState.forEach((prop, index) => {
            var age = dayjs().diff(dayjs(prop.dateOfBirth), "year");

            if (!prop.isGuardian) {
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
                if (prop.type == "Person" && prop.dateOfBirth !== "" && age <= 18 && IsEmptyString(prop.guardian)) {
                    setPropertyValidationState(index, "guardian", "guardian is required");
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
                if (prop.type == "Charity" && IsEmptyNumber(prop.donationAmount)) {
                    setPropertyValidationState(index, "donationAmount", "Donation Amount is required");
                    isValid = false;
                }
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    }

    const validate = (index: number) => {
        let isValid: boolean = true;
        var prop = formState[index];
        var age = dayjs().diff(dayjs(formState[index].dateOfBirth), "year");

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
        if (prop.type == "Person" && prop.dateOfBirth !== "" && age <= 18 && prop.isGuardian) {
            setPropertyValidationState(index, "dateOfBirth", "Guardian age must be greater than 18");
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
        if (prop.type == "Charity" && IsEmptyNumber(prop.donationAmount)) {
            setPropertyValidationState(index, "donationAmount", "Donation Amount is required");
            isValid = false;
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
        let routeValue = routeState.find(s => s.currentPath == location.pathname);
        navigate(routeValue?.nextPath ?? "/your_will/payment");
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
                                    label={`BENEFICIARIY ${index + 1}`}
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
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton onClick={handleNextClick} />
            </div>
            <Modal
                className='flex flex-col justify-center w-full items-center'
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <div className='bg-white p-6 max-w-lg flex flex-col w-full'>
                    <p className='pb-4'>Add Guardian</p>
                    <BeneficiaryForm isGuardian index={formState.length - 1} />
                    <CustomButton label='Save Guardian' onClick={() => saveGuardianAsync(formState.length - 1)} />
                </div>
            </Modal>
        </div>
    )
}

export default BeneficiariesPage;   
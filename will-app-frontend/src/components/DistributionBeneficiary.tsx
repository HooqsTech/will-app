import { Modal } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { upsertBeneficiary } from '../api/beneficiary';
import { beneficiariesState, IBeneficiaryState } from '../atoms/BeneficiariesState';
import { userState } from '../atoms/UserDetailsState';
import { beneficiariesValidationState, emptyBeneficiariesValidationState, IBeneficiaryValidationState } from '../atoms/validationStates/BeneficiariesValidationState';
import { BENEFICIARIES } from '../constants';
import { IBeneficiary } from '../models/beneficiary';
import { IsEmptyNumber, IsEmptyString } from '../utils';
import AddButton from './AddButton';
import CustomButton from './CustomButton';
import BeneficiaryForm from './Forms/BeneficiaryForm';

const DistributionBeneficiary = () => {
    const [beneficiaryState, setBeneficiaryState] = useRecoilState<IBeneficiaryState[]>(beneficiariesState);
    const setBeneficiaryValidationState = useSetRecoilState<IBeneficiaryValidationState[]>(beneficiariesValidationState);
    const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState(false);
    const [isGuardianModalOpen, setIsGuardianModalOpen] = useState(false);
    const [beneficiaryIndex, setBeneficiaryIndex] = useState(-1);
    const user = useRecoilValue(userState);

    const addBeneficiaryItem = () => {
        setBeneficiaryState((prevState) => [
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
        setBeneficiaryValidationState((prevState) => [
            ...prevState,
            emptyBeneficiariesValidationState
        ])
        setIsBeneficiaryModalOpen(true);
        setBeneficiaryIndex(beneficiaryState.length);
    };

    const addGuardianItem = () => {
        setBeneficiaryState((prevState) => [
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
        setBeneficiaryValidationState((prevState) => [
            ...prevState,
            emptyBeneficiariesValidationState
        ])
        setIsGuardianModalOpen(true);
    }

    const removeLastBeneficiary = () => {
        var newState = beneficiaryState.slice(0, beneficiaryState.length - 1);
        setBeneficiaryState(newState);
    }

    const validate = (index: number) => {
        let isValid: boolean = true;
        var prop = beneficiaryState[index];
        var age = dayjs().diff(dayjs(beneficiaryState[index].dateOfBirth), "year");

        if (IsEmptyString(prop.type)) {
            setValidationState(index, "type", "Beneficiary Type is required");
            isValid = false;
        }
        if (prop.type == "Person" && IsEmptyString(prop.fullName)) {
            setValidationState(index, "fullName", "Name is required");
            isValid = false;
        }
        if (prop.type == "Person" && IsEmptyString(prop.gender)) {
            setValidationState(index, "gender", "Gender is required");
            isValid = false;
        }
        if (prop.type == "Person" && IsEmptyString(prop.dateOfBirth)) {
            setValidationState(index, "dateOfBirth", "DOB is required");
            isValid = false;
        }
        if (prop.type == "Person" && prop.dateOfBirth !== "" && age <= 18 && prop.isGuardian) {
            setValidationState(index, "dateOfBirth", "Guardian age must be greater than 18");
            isValid = false;
        }
        if (prop.type == "Person" && IsEmptyString(prop.email)) {
            setValidationState(index, "email", "Email is required");
            isValid = false;
        }
        if (prop.type == "Person" && IsEmptyString(prop.phone)) {
            setValidationState(index, "phone", "Phone is required");
            isValid = false;
        }
        if (prop.type == "Person" && IsEmptyString(prop.relationship)) {
            setValidationState(index, "relationship", "Relationship is required");
            isValid = false;
        }
        if (prop.type == "Charity" && IsEmptyString(prop.charityType)) {
            setValidationState(index, "charityType", "Charity Type is required");
            isValid = false;
        }
        if (prop.type == "Charity" && IsEmptyString(prop.organization)) {
            setValidationState(index, "organization", "Organization is required");
            isValid = false;
        }
        if (prop.type == "Charity" && IsEmptyNumber(prop.donationAmount)) {
            setValidationState(index, "donationAmount", "Donation Amount is required");
            isValid = false;
        }
        return isValid;
    }

    const setValidationState = (index: number, key: keyof IBeneficiaryValidationState, value: string) => {
        setBeneficiaryValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const saveBeneficiaryorGuardianAsync = async (index: number) => {
        // VALIDATE
        if (!validate(index)) return;

        await saveBeneficiaryAsync(beneficiaryState[index], index);

        if (beneficiaryState[index].isGuardian === true) {

            setIsGuardianModalOpen(false);
        } else {
            setIsBeneficiaryModalOpen(false);
        }
    }

    const saveBeneficiaryAsync = async (property: IBeneficiaryState, index: number) => {
        let data: IBeneficiary = {
            id: property.id,
            type: BENEFICIARIES,
            subtype: "",
            userId: user.userId,
            data: property
        }
        let upsertedBeneficiary = await upsertBeneficiary(data);

        setBeneficiaryState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedBeneficiary.data, id: upsertedBeneficiary.id } : item))
        );
    }

    return (
        <>
            <AddButton onClick={addBeneficiaryItem} label={`BENEFICIARY`} />
            <Modal
                className='flex flex-col justify-center w-full items-center'
                open={isBeneficiaryModalOpen}
                onClose={() => { setIsBeneficiaryModalOpen(false); removeLastBeneficiary() }}
            >
                <div className='bg-white p-6 max-w-lg flex flex-col w-full'>
                    <p className='pb-4'>Add Beneficiary</p>
                    <BeneficiaryForm addGuardian={addGuardianItem} index={beneficiaryIndex} />
                    <CustomButton label='Save Beneficiary' onClick={() => saveBeneficiaryorGuardianAsync(beneficiaryIndex)} />
                </div>
            </Modal>
            <Modal
                className='flex flex-col justify-center w-full items-center'
                open={isGuardianModalOpen}
                onClose={() => { setIsGuardianModalOpen(false); removeLastBeneficiary() }}
            >
                <div className='bg-white p-6 max-w-lg flex flex-col w-full'>
                    <p className='pb-4'>Add Guardian</p>
                    <BeneficiaryForm isGuardian index={beneficiaryState.length - 1} />
                    <CustomButton label='Save Guardian' onClick={() => saveBeneficiaryorGuardianAsync(beneficiaryState.length - 1)} />
                </div>
            </Modal></>

    )
}

export default DistributionBeneficiary
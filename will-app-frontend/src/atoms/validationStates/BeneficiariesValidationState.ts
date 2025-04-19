import { atom } from 'recoil';

export interface IBeneficiaryValidationState {
    id: string;
    type: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    relationship: string;
    charityType: string;
    organization: string;
    otherOrganization: string;
    aadhaarNumber: string;
    donationAmount: string;
    guardian: string;
    title: string
}

export const beneficiariesValidationState = atom<IBeneficiaryValidationState[]>({
    key: 'beneficiariesValidationState',
    default: [{
        id: "",
        type: "",
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        relationship: "",
        aadhaarNumber: "",
        charityType: "",
        organization: "",
        otherOrganization: "",
        donationAmount: "",
        guardian: "",
        title: ""
    }]
});

export var emptyBeneficiariesValidationState: IBeneficiaryValidationState = {
    id: "",
    type: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    aadhaarNumber: "",
    relationship: "",
    charityType: "",
    organization: "",
    otherOrganization: "",
    donationAmount: "",
    guardian: "",
    title: ""
};
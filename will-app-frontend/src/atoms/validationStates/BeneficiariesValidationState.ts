import { atom } from 'recoil';

export interface IBeneficiaryValidationState {
    id: string;
    type: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    relationship: string;
    charityType: string;
    organization: string;
    otherOrganization: string;
    donationAmount: string;
}

export const beneficiariesValidationState = atom<IBeneficiaryValidationState[]>({
    key: 'beneficiariesValidationState',
    default: [{
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
        donationAmount: "",
    }]
});

export var emptyBeneficiariesValidationState: IBeneficiaryValidationState = {
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
    donationAmount: "",
};
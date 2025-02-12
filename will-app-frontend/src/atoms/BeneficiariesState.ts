import { Dayjs } from 'dayjs';
import { atom } from 'recoil';

export interface IBeneficiaryState {
    type: string;
    fullName: string;
    gender: string;
    dateOfBirth: Dayjs | null;
    email: string;
    phone: string;
    relationship: string;
    charityType: string;
    organization: string;
    otherOrganization: string;
    donationAmount: number | null;
}

export const beneficiariesState = atom<IBeneficiaryState[]>({
    key: 'beneficiariesState',
    default: [{
        type: "",
        fullName: "",
        gender: "",
        dateOfBirth: null,
        email: "",
        phone: "",
        relationship: "",
        charityType: "",
        organization: "",
        otherOrganization: "",
        donationAmount: null,
    }]
});
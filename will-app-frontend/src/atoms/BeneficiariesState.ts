
import { atom } from 'recoil';

export interface IBeneficiaryState {
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
    donationAmount: number | null;
    aadhaarNumber: string;
    isGuardian?: boolean
    guardian?: string
}

export const beneficiariesState = atom<IBeneficiaryState[]>({
    key: 'beneficiariesState',
    default: []
});
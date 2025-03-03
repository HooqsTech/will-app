import { atom } from 'recoil';

export interface IBankDetailsValidationState {
    id: string
    accountType: string;
    bankName: string;
    accountNumber: string;
    branch: string;
    city: string;
}

export const bankDetailsValidationState = atom<IBankDetailsValidationState[]>({
    key: 'bankDetailsValidationState',
    default: [{
        id: "",
        accountType: "",
        accountNumber: "",
        bankName: "",
        branch: "",
        city: ""
    }]
});
import { atom } from 'recoil';

export interface IBankDetailsValidationState {
    id: string
    accountType: string;
    bankName: string;
    accountNumber: string;
    state: string;
    branch: string;
    city: string;
}

export const bankDetailsValidationState = atom<IBankDetailsValidationState[]>({
    key: 'bankDetailsValidationState',
    default: [{
        id: "",
        accountType: "",
        accountNumber: "",
        state: "",
        bankName: "",
        branch: "",
        city: ""
    }]
});

export var emptyBankAccountValidationState: IBankDetailsValidationState = {
    id: "",
    accountType: "",
    accountNumber: "",
    state: "",
    bankName: "",
    branch: "",
    city: ""
}
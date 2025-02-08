import { atom } from 'recoil';

export interface IBankDetailsState {
    accountType: string;
    bankName: string;
    accountNumber: string;
    branch: string;
    city: string;
}

export const bankDetailsState = atom<IBankDetailsState[]>({
    key: 'bankDetailsState',
    default: [{
        accountType: "",
        accountNumber: "",
        bankName: "",
        branch: "",
        city: ""
    }]
});
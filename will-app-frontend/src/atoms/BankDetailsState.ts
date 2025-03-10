import { atom } from 'recoil';

export interface IBankDetailsState {
    id: string
    accountType: string;
    bankName: string;
    accountNumber: string;
    branch: string;
    city: string;
}

export const bankDetailsState = atom<IBankDetailsState[]>({
    key: 'bankDetailsState',
    default: [{
        id: "",
        accountType: "",
        accountNumber: "",
        bankName: "",
        branch: "",
        city: ""
    }]
});
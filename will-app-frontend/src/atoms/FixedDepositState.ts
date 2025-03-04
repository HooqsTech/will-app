import { atom } from 'recoil';

export interface IFixedDepositState {
    id: string;
    noOfHolders: string;
    bankName: string;
    accountNumber: string;
    branch: string;
    city: string;
}

export const fixedDepositsState = atom<IFixedDepositState[]>({
    key: 'fixedDepositsState',
    default: [{
        id: "",
        noOfHolders: "",
        accountNumber: "",
        bankName: "",
        branch: "",
        city: ""
    }]
});
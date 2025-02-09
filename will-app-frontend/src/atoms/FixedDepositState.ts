import { atom } from 'recoil';

export interface IFixedDepositState {
    noOfHolders: string;
    bankName: string;
    accountNumber: string;
    branch: string;
    city: string;
}

export const fixedDepositsState = atom<IFixedDepositState[]>({
    key: 'fixedDepositsState',
    default: [{
        noOfHolders: "",
        accountNumber: "",
        bankName: "",
        branch: "",
        city: ""
    }]
});
import { atom } from 'recoil';

export interface IFixedDepositValidationState {
    noOfHolders: string;
    bankName: string;
    accountNumber: string;
    branch: string;
    city: string;
}

export const fixedDepositsValidationState = atom<IFixedDepositValidationState[]>({
    key: 'fixedDepositsValidationState',
    default: [{
        noOfHolders: "",
        accountNumber: "",
        bankName: "",
        branch: "",
        city: ""
    }]
});

export var emptyFixedDepositsValidationState: IFixedDepositValidationState = {
    noOfHolders: "",
    accountNumber: "",
    bankName: "",
    branch: "",
    city: ""
}
import { atom } from 'recoil';

export interface IFixedDepositValidationState {
    noOfHolders: string;
    bankName: string;
    accountNumber: string;
    branch: string;
    state: string;
    city: string;
}

export const fixedDepositsValidationState = atom<IFixedDepositValidationState[]>({
    key: 'fixedDepositsValidationState',
    default: [{
        noOfHolders: "",
        accountNumber: "",
        bankName: "",
        state: "",
        branch: "",
        city: ""
    }]
});

export var emptyFixedDepositsValidationState: IFixedDepositValidationState = {
    noOfHolders: "",
    accountNumber: "",
    bankName: "",
    state: "",
    branch: "",
    city: ""
}
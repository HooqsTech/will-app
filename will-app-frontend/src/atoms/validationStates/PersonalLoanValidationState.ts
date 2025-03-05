import { atom } from 'recoil';

export interface IPersonalLoanValidationState {
    id: string;
    nameOfBank: string;
    loanAmount: string;
    accountNumber: string;
}

export const personalLoanValidationState = atom<IPersonalLoanValidationState[]>({
    key: 'personalLoanValidationState',
    default: [{
        id: "",
        nameOfBank: "",
        loanAmount: "",
        accountNumber: "",
    }]
});

export var emptyPersonalLoanValidationState: IPersonalLoanValidationState = {
    id: "",
    nameOfBank: "",
    loanAmount: "",
    accountNumber: "",
}
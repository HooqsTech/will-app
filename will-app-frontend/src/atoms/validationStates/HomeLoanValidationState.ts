import { atom } from 'recoil';

export interface IHomeLoanValidationState {
    id: string;
    nameOfBank: string;
    loanAmount: string;
    accountNumber: string;
}

export const homeLoanValidationState = atom<IHomeLoanValidationState[]>({
    key: 'homeLoanValidationState',
    default: [{
        id: "",
        nameOfBank: "",
        loanAmount: "",
        accountNumber: "",
    }]
});

export var emptyHomeLoanValidationState: IHomeLoanValidationState = {
    id: "",
    nameOfBank: "",
    loanAmount: "",
    accountNumber: "",
}
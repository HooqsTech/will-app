import { atom } from 'recoil';

export interface IEducationLoanValidationState {
    id: string;
    nameOfBank: string;
    loanAmount: string;
}

export const educationLoanValidationState = atom<IEducationLoanValidationState[]>({
    key: 'educationLoanValidationState',
    default: [{
        id: "",
        nameOfBank: "",
        loanAmount: "",
    }]
});

export var emptyEducationLoanValidationState: IEducationLoanValidationState = {
    id: "",
    nameOfBank: "",
    loanAmount: "",
};
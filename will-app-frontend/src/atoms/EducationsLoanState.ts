import { atom } from 'recoil';

export interface IEducationLoanState {
    nameOfBank: string;
    loanAmount: number | undefined;
}

export const educationLoansState = atom<IEducationLoanState[]>({
    key: 'educationLoansState',
    default: [{
        nameOfBank: "",
        loanAmount: undefined,
    }]
});
import { atom } from 'recoil';

export interface IEducationLoanState {
    id: string;
    nameOfBank: string;
    loanAmount: number | undefined;
}

export const educationLoansState = atom<IEducationLoanState[]>({
    key: 'educationLoansState',
    default: [{
        id: "",
        nameOfBank: "",
        loanAmount: undefined,
    }]
});
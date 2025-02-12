import { atom } from 'recoil';

export interface IPersonalLoanState {
    nameOfBank: string;
    loanAmount: number | undefined;
    accountNumber: string;
}

export const personalLoansState = atom<IPersonalLoanState[]>({
    key: 'personalLoansState',
    default: [{
        nameOfBank: "",
        loanAmount: undefined,
        accountNumber: "",
    }]
});
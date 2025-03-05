import { atom } from 'recoil';

export interface IPersonalLoanState {
    id: string;
    nameOfBank: string;
    loanAmount: number | undefined;
    accountNumber: string;
}

export const personalLoansState = atom<IPersonalLoanState[]>({
    key: 'personalLoansState',
    default: [{
        id: "",
        nameOfBank: "",
        loanAmount: undefined,
        accountNumber: "",
    }]
});
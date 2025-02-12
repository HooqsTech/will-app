import { atom } from 'recoil';

export interface IHomeLoanState {
    nameOfBank: string;
    loanAmount: number | undefined;
    accountNumber: string;
}

export const homeLoansState = atom<IHomeLoanState[]>({
    key: 'homeLoansState',
    default: [{
        nameOfBank: "",
        loanAmount: undefined,
        accountNumber: "",
    }]
});
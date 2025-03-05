import { atom } from 'recoil';

export interface IHomeLoanState {
    id: string,
    nameOfBank: string;
    loanAmount: number | undefined;
    accountNumber: string;
}

export const homeLoansState = atom<IHomeLoanState[]>({
    key: 'homeLoansState',
    default: [{
        id: "",
        nameOfBank: "",
        loanAmount: undefined,
        accountNumber: "",
    }]
});
import { atom } from 'recoil';

export interface IDematAccountState {
    brokerName: string;
    accountNumber: string;
}

export const dematAccountsState = atom<IDematAccountState[]>({
    key: 'dematAccountsState',
    default: [{
        brokerName: "",
        accountNumber: ""
    }]
});
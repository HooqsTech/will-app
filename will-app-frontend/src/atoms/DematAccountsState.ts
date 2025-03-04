import { atom } from 'recoil';

export interface IDematAccountState {
    id: string;
    brokerName: string;
    accountNumber: string;
}

export const dematAccountsState = atom<IDematAccountState[]>({
    key: 'dematAccountsState',
    default: [{
        id: "",
        brokerName: "",
        accountNumber: ""
    }]
});
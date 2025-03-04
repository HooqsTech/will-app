import { atom } from 'recoil';

export interface IPensionAccountState {
    id: string;
    schemeName: string;
    bankName: string;
}

export const pensionAccountsState = atom<IPensionAccountState[]>({
    key: 'pensionAccountsState',
    default: [{
        id: "",
        schemeName: "",
        bankName: "",
    }]
});
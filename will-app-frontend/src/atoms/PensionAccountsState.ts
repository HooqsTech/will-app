import { atom } from 'recoil';

export interface IPensionAccountState {
    schemeName: string;
    bankName: string;
}

export const pensionAccountsState = atom<IPensionAccountState[]>({
    key: 'pensionAccountsState',
    default: [{
        schemeName: "",
        bankName: "",
    }]
});
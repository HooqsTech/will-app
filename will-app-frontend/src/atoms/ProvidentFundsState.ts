import { atom } from 'recoil';

export interface IProvidentFundState {
    type: string;
    bankName: string;
    branch: string;
    city: string;
}

export const providentFundsState = atom<IProvidentFundState[]>({
    key: 'providentFundsState',
    default: [{
        type: "",
        bankName: "",
        branch: "",
        city: ""
    }]
});
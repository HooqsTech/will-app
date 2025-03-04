import { atom } from 'recoil';

export interface IProvidentFundState {
    id: string;
    type: string;
    bankName: string;
    branch: string;
    city: string;
}

export const providentFundsState = atom<IProvidentFundState[]>({
    key: 'providentFundsState',
    default: [{
        id: "",
        type: "",
        bankName: "",
        branch: "",
        city: ""
    }]
});
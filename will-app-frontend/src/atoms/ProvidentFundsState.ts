import { atom } from 'recoil';

export interface IProvidentFundState {
    id: string;
    type: string;
    bankName: string;
    branch: string;
    city: string;
    uanNumber: string;
    state:string;
    gpfNumber: string;
}

export const providentFundsState = atom<IProvidentFundState[]>({
    key: 'providentFundsState',
    default: [{
        id: "",
        type: "",
        bankName: "",
        branch: "",
        city: "",
        uanNumber: "",
        state: "",
        gpfNumber: ""
    }]
});
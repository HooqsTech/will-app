import { atom } from 'recoil';

export interface IProvidentFundValidationState {
    id: string;
    type: string;
    bankName: string;
    branch: string;
    city: string;
    uanNumber: string;
    state:string;
    gpfNumber: string;
}

export const providentFundValidationState = atom<IProvidentFundValidationState[]>({
    key: 'providentFundValidationState',
    default: [{
        id: "",
        type: "",
        bankName: "",
        branch: "",
        city: "",
        uanNumber: "",
        state: "",
        gpfNumber: "",
    }]
});

export const emptyProvidentFundValidationState: IProvidentFundValidationState = {
    id: "",
    type: "",
    bankName: "",
    branch: "",
    city: "",
    uanNumber: "",
    state: "",
    gpfNumber: "",
}
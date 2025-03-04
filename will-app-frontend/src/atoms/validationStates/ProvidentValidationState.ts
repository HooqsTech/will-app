import { atom } from 'recoil';

export interface IProvidentFundValidationState {
    id: string;
    type: string;
    bankName: string;
    branch: string;
    city: string;
}

export const providentFundValidationState = atom<IProvidentFundValidationState[]>({
    key: 'providentFundValidationState',
    default: [{
        id: "",
        type: "",
        bankName: "",
        branch: "",
        city: ""
    }]
});

export const emptyPropertyValidationState: IProvidentFundValidationState = {
    id: "",
    type: "",
    bankName: "",
    branch: "",
    city: ""
}
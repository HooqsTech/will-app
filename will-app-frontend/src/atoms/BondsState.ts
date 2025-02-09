import { atom } from 'recoil';

export interface IBondState {
    type: string;
    financialServiceProviderName: string;
    certificateNumber: string;
}

export const bondsState = atom<IBondState[]>({
    key: 'bondsState',
    default: [{
        type: "",
        financialServiceProviderName: "",
        certificateNumber: ""
    }]
});
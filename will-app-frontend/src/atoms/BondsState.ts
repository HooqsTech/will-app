import { atom } from 'recoil';

export interface IBondState {
    id: string;
    type: string;
    financialServiceProviderName: string;
    certificateNumber: string;
}

export const bondsState = atom<IBondState[]>({
    key: 'bondsState',
    default: [{
        id: "",
        type: "",
        financialServiceProviderName: "",
        certificateNumber: ""
    }]
});

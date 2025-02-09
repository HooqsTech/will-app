import { atom } from 'recoil';

export interface IDebentureState {
    type: string;
    financialServiceProviderName: string;
    certificateNumber: string;
}

export const debenturesState = atom<IDebentureState[]>({
    key: 'debenturesState',
    default: [{
        type: "",
        financialServiceProviderName: "",
        certificateNumber: ""
    }]
});
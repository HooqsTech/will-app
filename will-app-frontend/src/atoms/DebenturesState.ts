import { atom } from 'recoil';

export interface IDebentureState {
    id: string;
    type: string;
    financialServiceProviderName: string;
    certificateNumber: string;
}

export const debenturesState = atom<IDebentureState[]>({
    key: 'debenturesState',
    default: [{
        id: "",
        type: "",
        financialServiceProviderName: "",
        certificateNumber: ""
    }]
});

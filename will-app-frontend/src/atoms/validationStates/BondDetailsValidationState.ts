import { atom } from 'recoil';

export interface IBondValidationState {
    id: string;
    type: string;
    financialServiceProviderName: string;
    certificateNumber: string;
}

export const bondsValidationState = atom<IBondValidationState[]>({
    key: 'bondsValidationState',
    default: [{
        id: "",
        type: "",
        financialServiceProviderName: "",
        certificateNumber: ""
    }]
});

export var emptyBondValidationState: IBondValidationState = {
    id: "",
    type: "",
    financialServiceProviderName: "",
    certificateNumber: ""
};

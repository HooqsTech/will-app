import { atom } from 'recoil';

export interface IDebentureValidationState {
    id: string;
    type: string;
    financialServiceProviderName: string;
    certificateNumber: string;
}

export const debenturesValidationState = atom<IDebentureValidationState[]>({
    key: 'debenturesValidationState',
    default: [{
        id: "",
        type: "",
        financialServiceProviderName: "",
        certificateNumber: ""
    }]
});

export const emptyDebentureValidationState: IDebentureValidationState = {
    id: "",
    type: "",
    financialServiceProviderName: "",
    certificateNumber: ""
};
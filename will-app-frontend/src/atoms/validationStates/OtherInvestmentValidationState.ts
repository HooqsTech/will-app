import { atom } from 'recoil';

export interface IOtherInvestmentValidationState {
    id: string;
    type: string;
    financialServiceProviderName: string;
    certificateNumber: string;
}

export const otherInvestmentValidationState = atom<IOtherInvestmentValidationState[]>({
    key: 'otherInvestmentValidationState',
    default: [{
        id: "",
        type: "",
        financialServiceProviderName: "",
        certificateNumber: ""
    }]
});

export const emptyOtherInvestmentValidationState: IOtherInvestmentValidationState = {
    id: "",
    type: "",
    financialServiceProviderName: "",
    certificateNumber: ""
};

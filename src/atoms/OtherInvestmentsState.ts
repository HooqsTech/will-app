import { atom } from 'recoil';

export interface IOtherInvestmentState {
    type: string;
    financialServiceProviderName: string;
    certificateNumber: string;
}

export const otherInvestementState = atom<IOtherInvestmentState[]>({
    key: 'otherInvestementState',
    default: [{
        type: "",
        financialServiceProviderName: "",
        certificateNumber: ""
    }]
});
import { atom } from 'recoil';

export interface IOtherInvestmentState {
    id: string;
    type: string;
    financialServiceProviderName: string;
    certificateNumber: string;
}

export const otherInvestmentState = atom<IOtherInvestmentState[]>({
    key: 'otherInvestmentState',
    default: [{
        id: "",
        type: "",
        financialServiceProviderName: "",
        certificateNumber: ""
    }]
});

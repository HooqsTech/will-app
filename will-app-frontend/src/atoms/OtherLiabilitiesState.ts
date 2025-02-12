import { atom } from 'recoil';

export interface IOtherLiabilityState {
    nameOfLender: string;
    loanAmount: number | undefined;
    remainingAmount: number | undefined;
    accountNumber: string;
    description: string;
}

export const otherLiabilitiesState = atom<IOtherLiabilityState[]>({
    key: 'otherLiabilitiesState',
    default: [{
        nameOfLender: "",
        loanAmount: undefined,
        remainingAmount: undefined,
        accountNumber: "",
        description: "",
    }]
});
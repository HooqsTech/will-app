import { atom } from 'recoil';

export interface IOtherLiabilitiesValidationState {
    id: string;
    nameOfLender: string;
    loanAmount: string;
    remainingAmount: string;
    accountNumber: string;
    description: string;
}

export const otherLiabilitiesvalidationState = atom<IOtherLiabilitiesValidationState[]>({
    key: 'otherLiabilitiesvalidationState',
    default: [{
        id: "",
        nameOfLender: "",
        loanAmount: "",
        remainingAmount: "",
        accountNumber: "",
        description: "",
    }]
});

export var emptyOtherLiabilitiesValidationState: IOtherLiabilitiesValidationState = {
    id: "",
    nameOfLender: "",
    loanAmount: "",
    remainingAmount: "",
    accountNumber: "",
    description: "",
}
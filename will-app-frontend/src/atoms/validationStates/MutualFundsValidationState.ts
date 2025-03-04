import { atom } from 'recoil';

export interface IMutualFundValidationState {
    id: string;
    noOfHolders: string;
    fundName: string;
}

export const mutualFundValidationState = atom<IMutualFundValidationState[]>({
    key: 'mutualFundValidationState',
    default: [{
        id: "",
        noOfHolders: "",
        fundName: "",
    }]
});

export var emptyMutualFundsValidationState: IMutualFundValidationState = {
    id: "",
    noOfHolders: "",
    fundName: "",
}
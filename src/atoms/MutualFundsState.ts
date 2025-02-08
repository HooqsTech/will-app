import { atom } from 'recoil';

export interface IMutualFundState {
    noOfHolders: string;
    fundName: string;
}

export const mutualFundsState = atom<IMutualFundState[]>({
    key: 'mutualFundsState',
    default: [{
        noOfHolders: "",
        fundName: "",
    }]
});
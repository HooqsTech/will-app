import { atom } from 'recoil';

export interface IMutualFundState {
    id: string;
    noOfHolders: string;
    fundName: string;
}

export const mutualFundsState = atom<IMutualFundState[]>({
    key: 'mutualFundsState',
    default: [{
        id: "",
        noOfHolders: "",
        fundName: "",
    }]
});
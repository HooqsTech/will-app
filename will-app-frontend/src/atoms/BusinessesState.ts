import { atom } from 'recoil';

export interface IBusinessState {
    id: string;
    type: string;
    companyName: string;
    address: string;
    holdingPercentage: string;
    partnership: string;
    pan: string;
    natureOfHolding: string;
    typeOfSecurity: string;
}

export const businessesState = atom<IBusinessState[]>({
    key: 'businessesState',
    default: [{
        id: "",
        type: "",
        companyName: "",
        address: "",
        holdingPercentage: "",
        partnership: "",
        pan: "",
        natureOfHolding: "",
        typeOfSecurity: ""
    }]
});
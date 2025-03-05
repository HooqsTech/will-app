import { atom } from 'recoil';

export interface IBusinessValidationState {
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

export const businessesValidationState = atom<IBusinessValidationState[]>({
    key: 'businessesValidationState',
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

export var emptyBusinessesValidationState: IBusinessValidationState = {
    id: "",
    type: "",
    companyName: "",
    address: "",
    holdingPercentage: "",
    partnership: "",
    pan: "",
    natureOfHolding: "",
    typeOfSecurity: ""
}
import { atom } from 'recoil';

export interface IEscopValidationState {
    id: string;
    companyName: string;
    noOfUnitGraged: string;
    noOfVestedEscops: string;
    noOfUnVestedEscops: string;
}

export const escopsValidationState = atom<IEscopValidationState[]>({
    key: 'escopsValidationState',
    default: [{
        id: "",
        companyName: "",
        noOfUnitGraged: "",
        noOfVestedEscops: "",
        noOfUnVestedEscops: "",
    }]
});

export var emptyEscopValidationState: IEscopValidationState = {
    id: "",
    companyName: "",
    noOfUnitGraged: "",
    noOfVestedEscops: "",
    noOfUnVestedEscops: "",
};

import { atom } from 'recoil';

export interface IEscopState {
    companyName: string;
    noOfUnitGraged: string;
    noOfVestedEscops: string;
    noOfUnVestedEscops: string;
}

export const escopsState = atom<IEscopState[]>({
    key: 'escopsState',
    default: [{
        companyName: "",
        noOfUnitGraged: "",
        noOfVestedEscops: "",
        noOfUnVestedEscops: "",
    }]
});
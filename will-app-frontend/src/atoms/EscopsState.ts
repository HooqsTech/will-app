import { atom } from 'recoil';

export interface IEscopState {
    id: string;
    companyName: string;
    noOfUnitGraged: string;
    noOfVestedEscops: string;
    noOfUnVestedEscops: string;
}

export const escopsState = atom<IEscopState[]>({
    key: 'escopsState',
    default: [{
        id: "",
        companyName: "",
        noOfUnitGraged: "",
        noOfVestedEscops: "",
        noOfUnVestedEscops: "",
    }]
});

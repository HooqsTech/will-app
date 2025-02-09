import { atom } from 'recoil';

export interface IInsuranceDetailState {
    insuranceType: string;
    insuranceProvider: string;
    policyNumber: string;
}

export const insuranceDetailsState = atom<IInsuranceDetailState[]>({
    key: 'insuranceDetailsState',
    default: [{
        insuranceType: "",
        insuranceProvider: "",
        policyNumber: ""
    }]
});
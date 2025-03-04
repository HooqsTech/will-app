import { atom } from 'recoil';

export interface IInsurancePolicyState {
    id: ""
    insuranceType: string;
    insuranceProvider: string;
    policyNumber: string;
}

export const insurancePoliciesState = atom<IInsurancePolicyState[]>({
    key: 'insurancePoliciesState',
    default: [{
        id: "",
        insuranceType: "",
        insuranceProvider: "",
        policyNumber: ""
    }]
});
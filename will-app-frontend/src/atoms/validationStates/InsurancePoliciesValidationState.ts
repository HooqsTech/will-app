import { atom } from 'recoil';

export interface IInsurancePolicyValidationState {
    insuranceType: string;
    insuranceProvider: string;
    policyNumber: string;
}

export const insurancePoliciesValidationState = atom<IInsurancePolicyValidationState[]>({
    key: 'insurancePoliciesValidationState',
    default: [{
        insuranceType: "",
        insuranceProvider: "",
        policyNumber: ""
    }]
});

export var emptyInsurancePoliciesValidationState: IInsurancePolicyValidationState = {
    insuranceType: "",
    insuranceProvider: "",
    policyNumber: ""
}
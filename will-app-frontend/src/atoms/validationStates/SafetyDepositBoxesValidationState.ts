import { atom } from 'recoil';

export interface ISafetyDepositBoxValidationState {
    depositBoxType: string;
    bankName: string;
    branch: string;
    city: string;
}

export const safetyDepositBoxesValidationState = atom<ISafetyDepositBoxValidationState[]>({
    key: 'safetyDepositBoxesValidationState',
    default: [{
        depositBoxType: "",
        bankName: "",
        branch: "",
        city: ""
    }]
});

export var emptySafetyDepositBoxesValidationState: ISafetyDepositBoxValidationState = {
    depositBoxType: "",
    bankName: "",
    branch: "",
    city: ""
}
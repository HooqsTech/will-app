import { atom } from 'recoil';

export interface ISafetyDepositBoxState {
    depositBoxType: string;
    bankName: string;
    branch: string;
    city: string;
}

export const safetyDepositBoxesState = atom<ISafetyDepositBoxState[]>({
    key: 'safetyDepositBoxesState',
    default: [{
        depositBoxType: "",
        bankName: "",
        branch: "",
        city: ""
    }]
});
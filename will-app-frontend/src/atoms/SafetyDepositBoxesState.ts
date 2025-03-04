import { atom } from 'recoil';

export interface ISafetyDepositBoxState {
    id: string;
    depositBoxType: string;
    bankName: string;
    branch: string;
    city: string;
}

export const safetyDepositBoxesState = atom<ISafetyDepositBoxState[]>({
    key: 'safetyDepositBoxesState',
    default: [{
        id: "",
        depositBoxType: "",
        bankName: "",
        branch: "",
        city: ""
    }]
});
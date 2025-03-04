import { atom } from 'recoil';

export interface IDematAccountValidationState {
    id: string;
    brokerName: string;
    accountNumber: string;
}

export const dematAccountValidationState = atom<IDematAccountValidationState[]>({
    key: 'dematAccountValidationState',
    default: [{
        id: "",
        brokerName: "",
        accountNumber: ""
    }]
});

export var emptyPropertyValidationState: IDematAccountValidationState = {
    id: "",
    brokerName: "",
    accountNumber: ""
}
import { atom } from 'recoil';

export interface IPensionAccountValidationState {
    id: string;
    schemeName: string;
    bankName: string;
}

export const pensionAccountValidationState = atom<IPensionAccountValidationState[]>({
    key: 'pensionAccountValidationState',
    default: [{
        id: "",
        schemeName: "",
        bankName: "",
    }]
});


export var emptyPropertyValidationState: IPensionAccountValidationState = {
    id: "",
    schemeName: "",
    bankName: "",
}
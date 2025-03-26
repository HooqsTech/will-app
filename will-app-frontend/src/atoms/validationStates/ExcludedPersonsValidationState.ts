import { atom } from 'recoil';

export interface IExcludedPersonValidationState {
    fullName: "",
    relationship: "",
    reason: ""
}

export const excludedPersonsValidationState = atom<IExcludedPersonValidationState[]>({
    key: 'excludedPersonsValidationState',
    default: [{
        fullName: "",
        relationship: "",
        reason: ""
    }]
});


export var emptyExcludedPersonValidationState: IExcludedPersonValidationState = {
    fullName: "",
    relationship: "",
    reason: ""
};

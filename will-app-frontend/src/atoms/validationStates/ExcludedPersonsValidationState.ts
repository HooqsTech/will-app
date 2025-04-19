import { atom } from 'recoil';

export interface IExcludedPersonValidationState {
    firstName: "",
    lastName: "",
    title: "",
    relationship: "",
    reason: ""
}

export const excludedPersonsValidationState = atom<IExcludedPersonValidationState[]>({
    key: 'excludedPersonsValidationState',
    default: [{
        firstName: "",
        lastName: "",
        title: "",
        relationship: "",
        reason: ""
    }]
});


export var emptyExcludedPersonValidationState: IExcludedPersonValidationState = {
    firstName: "",
    lastName: "",
    title: "",
    relationship: "",
    reason: ""
};

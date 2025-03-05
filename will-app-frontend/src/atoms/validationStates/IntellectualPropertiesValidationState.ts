import { atom } from 'recoil';

export interface IIntellectualPropertyValidationState {
    id: string;
    type: string;
    identificationNumber: string;
    description: string;
}

export const intellectualPropertyValidationState = atom<IIntellectualPropertyValidationState[]>({
    key: 'intellectualPropertyValidationState',
    default: [{
        id: "",
        type: "",
        identificationNumber: "",
        description: ""
    }]
});

export var emptyIntellectualPropertyValidationState: IIntellectualPropertyValidationState = {
    id: "",
    type: "",
    identificationNumber: "",
    description: ""
};

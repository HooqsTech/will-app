import { atom } from 'recoil';

export interface IIntellectualPropertyState {
    type: string;
    identificationNumber: string;
    description: string;
}

export const intellectualPropertiesState = atom<IIntellectualPropertyState[]>({
    key: 'intellectualPropertiesState',
    default: [{
        type: "",
        identificationNumber: "",
        description: ""
    }]
});
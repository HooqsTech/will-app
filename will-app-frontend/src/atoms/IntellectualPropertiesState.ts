import { atom } from 'recoil';

export interface IIntellectualPropertyState {
    id: string;
    type: string;
    identificationNumber: string;
    description: string;
}

export const intellectualPropertiesState = atom<IIntellectualPropertyState[]>({
    key: 'intellectualPropertiesState',
    default: [{
        id: "",
        type: "",
        identificationNumber: "",
        description: ""
    }]
});
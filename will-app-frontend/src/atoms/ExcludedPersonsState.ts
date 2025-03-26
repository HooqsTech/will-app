import { atom } from 'recoil';

export interface IExcludedPersonState {
    id: string;
    fullName: string;
    relationship: string;
    reason: string
}

export const excludedPersonsState = atom<IExcludedPersonState[]>({
    key: 'excludedPersonsState',
    default: [{
        id: "",
        fullName: "",
        relationship: "",
        reason: ""
    }]
});
import { atom } from 'recoil';

export interface IExcludedPersonState {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    relationship: string;
    reason: string
}

export const excludedPersonsState = atom<IExcludedPersonState[]>({
    key: 'excludedPersonsState',
    default: []
});
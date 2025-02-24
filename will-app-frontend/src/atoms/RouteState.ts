import { atom } from 'recoil';

export interface IRouteState {
    currentPath: string;
    nextPath: string;
}

export const routesState = atom<IRouteState[]>({
    key: 'routesState',
    default: [{
        currentPath: "",
        nextPath: "",
    }]
});
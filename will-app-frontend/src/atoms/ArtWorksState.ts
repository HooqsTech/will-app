import { atom } from 'recoil';

export interface IArtWorkState {
    id: string;
    name: string;
    description: string;
}

export const artWorksState = atom<IArtWorkState[]>({
    key: 'artWorksState',
    default: [{
        id: "",
        name: "",
        description: "",
    }]
});

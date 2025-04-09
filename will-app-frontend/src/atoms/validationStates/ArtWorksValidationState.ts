import { atom } from 'recoil';

export interface IArtWorkValidationState {
    name: string;
    description: string;
}

export const artWorksValidationState = atom<IArtWorkValidationState[]>({
    key: 'artWorksValidationState',
    default: [{
        name: "",
        description: "",
    }]
});

export var emptyArtWorkValidationState: IArtWorkValidationState = {
    name: "",
    description: "",
};

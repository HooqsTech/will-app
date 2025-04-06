import { atom } from 'recoil';

export interface IPetValidationState {
    petName: string
    animalBreed: string
    amount: string
}

export const petsValidationState = atom<IPetValidationState[]>({
    key: 'petsValidationState',
    default: [{
        petName: "",
        animalBreed: "",
        amount: ""
    }]
});

export var emptyPetValidationState: IPetValidationState = {
    petName: "",
    animalBreed: "",
    amount: ""
}
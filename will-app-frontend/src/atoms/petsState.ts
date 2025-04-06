import { atom } from 'recoil';

export interface IPetState {
    id: string
    petName: string
    animalBreed: string
    amount: string
}

export const petsState = atom<IPetState[]>({
    key: 'petsState',
    default: [{
        id: "",
        petName: "",
        animalBreed: "",
        amount: ""
    }]
});
import { atom } from 'recoil';

export interface IJewelleriesValidationState {
    id: string;
    type: string;
    description: string;
    preciousMetalInWeight: string;
}

export const jewelleriesValidationState = atom<IJewelleriesValidationState[]>({
    key: 'jewelleriesValidationState',
    default: [{
        id: "",
        type: "",
        description: "",
        preciousMetalInWeight: ""
    }]
});

export var emptyJewelleryValidationState: IJewelleriesValidationState = {
    id: "",
    type: "",
    description: "",
    preciousMetalInWeight: ""
}
import { atom } from 'recoil';

export interface IJewelleryState {
    type: string;
    description: string;
    preciousMetalInWeight: string;
}

export const jewelleriesState = atom<IJewelleryState[]>({
    key: 'jewelleriesState',
    default: [{
        type: "",
        description: "",
        preciousMetalInWeight: ""
    }]
});
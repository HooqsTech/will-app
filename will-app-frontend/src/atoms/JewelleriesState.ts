import { atom } from 'recoil';

export interface IJewelleryState {
    id: string;
    type: string;
    description: string;
    preciousMetalInWeight: string;
}

export const jewelleriesState = atom<IJewelleryState[]>({
    key: 'jewelleriesState',
    default: [{
        id: "",
        type: "",
        description: "",
        preciousMetalInWeight: ""
    }]
});
import { atom } from 'recoil';

export interface IVehicleState {
    id: string;
    type: string;
    brandOrModel: string;
    registrationNumber: string;
}

export const vehiclesState = atom<IVehicleState[]>({
    key: 'vehiclesState',
    default: [{
        id: "",
        type: "",
        brandOrModel: "",
        registrationNumber: ""
    }]
});

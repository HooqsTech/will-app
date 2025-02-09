import { atom } from 'recoil';

export interface IVehicleState {
    brandOrModel: string;
    registrationNumber: string;
}

export const vehiclesState = atom<IVehicleState[]>({
    key: 'vehiclesState',
    default: [{
        brandOrModel: "",
        registrationNumber: ""
    }]
});
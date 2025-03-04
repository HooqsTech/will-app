import { atom } from 'recoil';

export interface IVehicleValidationState {
    id: string;
    brandOrModel: string;
    registrationNumber: string;
}

export const vehiclesValidationState = atom<IVehicleValidationState[]>({
    key: 'vehiclesValidationState',
    default: [{
        id: "",
        brandOrModel: "",
        registrationNumber: ""
    }]
});

export var emptyVehicleValidationState: IVehicleValidationState = {
    id: "",
    brandOrModel: "",
    registrationNumber: ""
};
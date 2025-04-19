import { atom } from 'recoil';

export interface IVehicleValidationState {
    id: string;
    brandOrModel: string;
    registrationNumber: string;
    type: string
}

export const vehiclesValidationState = atom<IVehicleValidationState[]>({
    key: 'vehiclesValidationState',
    default: [{
        id: "",
        brandOrModel: "",
        registrationNumber: "",
        type: ""
    }]
});

export var emptyVehicleValidationState: IVehicleValidationState = {
    id: "",
    brandOrModel: "",
    registrationNumber: "",
    type: ""
};
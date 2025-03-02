import { atom } from 'recoil';

export interface IPropertiesValidationState {
    id: string
    propertyType: string;
    ownershipType: string;
    address: string;
    pincode: string;
    city: string;
}

export const propertiesValidationState = atom<IPropertiesValidationState[]>({
    key: 'propertiesValidationState',
    default: [{
        id: "",
        propertyType: "",
        ownershipType: "",
        address: "",
        pincode: "",
        city: ""
    }]
});

export var emptyPropertyValidationState: IPropertiesValidationState = {
    id: "",
    propertyType: "",
    ownershipType: "",
    address: "",
    pincode: "",
    city: ""
}
import { atom } from 'recoil';

export interface IPropertiesState {
    propertyType: string;
    ownershipType: string;
    address: string;
    pincode: string;
    city: string;
}

export const propertiesState = atom<IPropertiesState[]>({
    key: 'propertiesState',
    default: [{
        propertyType: "",
        ownershipType: "",
        address: "",
        pincode: "",
        city: ""
    }]
});
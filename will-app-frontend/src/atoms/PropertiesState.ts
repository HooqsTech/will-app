import { atom } from 'recoil';

export interface IPropertiesState {
    id: string
    propertyType: string;
    ownershipType: string;
    address: string;
    pincode: string;
    city: string;
}

export const propertiesState = atom<IPropertiesState[]>({
    key: 'propertiesState',
    default: [{
        id: "",
        propertyType: "",
        ownershipType: "",
        address: "",
        pincode: "",
        city: ""
    }]
});
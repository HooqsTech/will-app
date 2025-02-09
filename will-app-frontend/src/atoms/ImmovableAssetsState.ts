import { atom } from 'recoil';

export interface IImmovableAssetState {
    propertyType: string;
    ownershipType: string;
    address: string;
    pincode: string;
    city: string;
}

export const immovableAssetsState = atom<IImmovableAssetState[]>({
    key: 'immovableAssetsState',
    default: [{
        propertyType: "",
        ownershipType: "",
        address: "",
        pincode: "",
        city: ""
    }]
});
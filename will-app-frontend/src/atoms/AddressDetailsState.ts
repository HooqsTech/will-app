import { atom } from 'recoil';

export interface IAddressDetailsState {
    address1: string,
    address2: string,
    pincode: string,
    city: string,
    state: string,
    phoneNumber: string,
    email: string
}

export const addressDetailsState = atom<IAddressDetailsState>({
    key: 'addressDetailsState',
    default: {
        address1: "",
        address2: "",
        pincode: "",
        city: "",
        state: "",
        phoneNumber: "",
        email: ""
    }
});
import { atom } from 'recoil';

export interface IAddressDetailsValidationState {
    address1: string,
    address2: string,
    pincode: string,
    city: string,
    state: string,
    phoneNumber: string,
    email: string
}

export const addressDetailsValidationState = atom<IAddressDetailsValidationState>({
    key: 'addressDetailsValidationState',
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
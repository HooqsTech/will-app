import { atom } from 'recoil';

export interface IAddressDetailsValidationState {
    address1: string,
    address2: string,
    pincode: string,
    city: string,
    state: string,
    phoneNumber: string,
    email: string,
    permAddress1: string,
    permAddress2: string
    permPincode: string,
    permCity: string,
    permState: string,
    permPhoneNumber: string,
    permEmail: string
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
        email: "",
        permAddress1: "",
        permAddress2: "",
        permPincode: "",
        permCity: "",
        permState: "",
        permPhoneNumber: "",
        permEmail: ""
    }
});
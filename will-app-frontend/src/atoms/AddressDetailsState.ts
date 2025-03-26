import { atom } from 'recoil';

export interface IAddressDetailsState {
    address1: string,
    address2: string,
    pincode: string,
    city: string,
    state: string,
    phoneNumber: string,
    email: string,
    sameAsPresentAddress: boolean,
    permAddress1: string,
    permAddress2: string
    permPincode: string,
    permCity: string,
    permState: string,
    permPhoneNumber: string,
    permEmail: string
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
        email: "",
        sameAsPresentAddress: false,
        permAddress1: "",
        permAddress2: "",
        permCity: "",
        permEmail: "",
        permPhoneNumber: "",
        permPincode: "",
        permState: ""
    }
});
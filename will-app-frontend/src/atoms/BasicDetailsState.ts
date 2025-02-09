import  { Dayjs } from 'dayjs';
import { atom } from 'recoil';

export interface IBasicDetailsState {
    fullName: string;
    fatherName: string;
    gender: string;
    dob: Dayjs | null;
    religion: string;
    aadhaarNumber: string;
    email: string;
    phoneNumber: string;
    address1: string;
    address2: string;
    pincode: string;
    city: string;
    state: string;
}

export const basicDetailsState = atom<IBasicDetailsState>({
    key: 'basicDetailsState',
    default: {
        fullName: "",
        fatherName: "",
        gender: "",
        dob: null,
        religion: "",
        aadhaarNumber: "",
        email: "",
        phoneNumber: "",
        address1: "",
        address2: "",
        pincode: "",
        city: "",
        state: "",
      }
});
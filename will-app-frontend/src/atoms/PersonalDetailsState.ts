import { atom } from 'recoil';

export interface IPersonalDetailsState {
    firstName: string,
    lastName: string,
    fatherName: string,
    userName: string,
    password: string,
    gender: string,
    dob: string,
    religion: string,
    aadhaarNumber: string,
    title: string
}

export const personalDetailsState = atom<IPersonalDetailsState>({
    key: 'personalDetailsState',
    default: {
        firstName: "",
        lastName: "",
        fatherName: "",
        userName: "",
        password: "",
        gender: "",
        dob: "",
        religion: "",
        aadhaarNumber: "",
        title: ""
    }
});
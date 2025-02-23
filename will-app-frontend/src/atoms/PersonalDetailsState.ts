import { atom } from 'recoil';

export interface IPersonalDetailsState {
    fullName: string,
    fatherName: string,
    userName: string,
    password: string,
    gender: string,
    dob: string,
    religion: string,
    aadhaarNumber: string
}

export const personalDetailsState = atom<IPersonalDetailsState>({
    key: 'personalDetailsState',
    default: {
        fullName: "",
        fatherName: "",
        userName: "",
        password: "",
        gender: "",
        dob: "",
        religion: "",
        aadhaarNumber: ""
    }
});
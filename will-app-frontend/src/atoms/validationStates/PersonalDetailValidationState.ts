import { atom } from 'recoil';

export interface IPersonalDetailsValidationState {
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

export const personalDetailsValidationState = atom<IPersonalDetailsValidationState>({
    key: 'personalDetailsValidationState',
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
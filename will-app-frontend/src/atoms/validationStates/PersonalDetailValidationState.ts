import { atom } from 'recoil';

export interface IPersonalDetailsValidationState {
    fullName: string,
    fatherName: string,
    userName: string,
    password: string,
    gender: string,
    dob: string,
    religion: string,
    aadhaarNumber: string
}

export const personalDetailsValidationState = atom<IPersonalDetailsValidationState>({
    key: 'personalDetailsValidationState',
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
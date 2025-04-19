import { atom } from 'recoil';

export interface IExecutorState {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    aadhaarNumber: string;
    email: string;
    phoneNumber: string;
    title: string
}

export const executorState = atom<IExecutorState[]>({
    key: 'executorState',
    default: [{
        id: "",
        firstName: "",
        lastName: "",
        gender: "",
        aadhaarNumber: "",
        dob: "",
        email: "",
        phoneNumber: "",
        title: ""
    }]
});

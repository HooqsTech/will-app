import { atom } from 'recoil';

export interface IExecutorState {
    id: string;
    fullName: string;
    gender: string;
    dob: string;
    aadhaarNumber: string;
    email: string;
    phoneNumber: string;
}

export const executorState = atom<IExecutorState[]>({
    key: 'executorState',
    default: [{
        id: "",
        fullName: "",
        gender: "",
        aadhaarNumber: "",
        dob: "",
        email: "",
        phoneNumber: ""
    }]
});

import { atom } from 'recoil';

export interface IExecutorState {
    id: string;
    fullName: string;
    gender: string;
    dob: string;
    email: string;
    phoneNumber: string;
}

export const executorState = atom<IExecutorState[]>({
    key: 'executorState',
    default: [{
        id: "",
        fullName: "",
        gender: "",
        dob: "",
        email: "",
        phoneNumber: ""
    }]
});

import { atom } from 'recoil';

export interface IExecutorValidationState {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    gender: string;
    dob: string;
    email: string;
    aadhaarNumber: string;
    phoneNumber: string;
}

export const executorValidationState = atom<IExecutorValidationState[]>({
    key: 'executorValidationState',
    default: [{
        id: "",
        firstName: "",
        lastName: "",
        title: "",
        gender: "",
        dob: "",
        aadhaarNumber: "",
        email: "",
        phoneNumber: ""
    }]
});

export var emptyExecutorValidationState: IExecutorValidationState = {
    id: "",
    firstName: "",
    lastName: "",
    title: "",
    gender: "",
    dob: "",
    email: "",
    aadhaarNumber: "",
    phoneNumber: ""
};

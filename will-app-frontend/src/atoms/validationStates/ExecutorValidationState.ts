import { atom } from 'recoil';

export interface IExecutorValidationState {
    id: string;
    fullName: string;
    gender: string;
    dob: string;
    email: string;
    phoneNumber: string;
}

export const executorValidationState = atom<IExecutorValidationState[]>({
    key: 'executorValidationState',
    default: [{
        id: "",
        fullName: "",
        gender: "",
        dob: "",
        email: "",
        phoneNumber: ""
    }]
});


export var emptyExecutorValidationState: IExecutorValidationState = {
    id: "",
    fullName: "",
    gender: "",
    dob: "",
    email: "",
    phoneNumber: ""
};

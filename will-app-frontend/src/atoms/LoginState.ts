import { atom } from 'recoil';

export interface ILoginState {
    phoneNumber: string;
    otp: string | undefined;
    userid: string;
    showOTP: boolean;
    confirmationResult:any;
}

export const loginState = atom<ILoginState>({
    key: 'loginState',
    default: {
        phoneNumber: "",
        otp: undefined,
        userid: "",
        showOTP: false,
        confirmationResult: undefined
    }
});
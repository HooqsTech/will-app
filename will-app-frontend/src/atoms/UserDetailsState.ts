import { atom } from 'recoil';

export interface IUserState {
    userId: string;
}

export const userState = atom<IUserState>({
    key: 'userState',
    default: {
        userId: "",
    }
});
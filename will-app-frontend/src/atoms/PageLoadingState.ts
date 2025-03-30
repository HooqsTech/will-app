import { atom } from 'recoil';

export const pageLoadingState = atom<boolean>({
    key: 'pageLoadingState',
    default: false
});

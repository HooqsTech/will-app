import { atom } from 'recoil';

export const guardianModalState = atom<boolean>({
    key: 'guardianModalState',
    default: false
});
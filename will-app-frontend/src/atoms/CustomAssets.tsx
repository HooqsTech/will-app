import { atom } from 'recoil';

export interface ICustomAssetState {
    description: string;
}

export const customAssetsState = atom<ICustomAssetState[]>({
    key: 'customAssetsState',
    default: [{
        description: "",
    }]
});
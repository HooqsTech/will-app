import { atom } from 'recoil';

export interface ICustomAssetState {
    id: string;
    description: string;
}

export const customAssetsState = atom<ICustomAssetState[]>({
    key: 'customAssetsState',
    default: [{
        id: "",
        description: "",
    }]
});
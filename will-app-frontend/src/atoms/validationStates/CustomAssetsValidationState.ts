import { atom } from 'recoil';

export interface ICustomAssetValidationState {
    id: string;
    description: string;
}

export const customAssetsValidationState = atom<ICustomAssetValidationState[]>({
    key: 'customAssetsValidationState',
    default: [{
        id: "",
        description: "",
    }]
});

export var emptyCustomAssetValidationState: ICustomAssetValidationState = {
    id: "",
    description: "",
};

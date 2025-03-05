import { atom } from 'recoil';

export interface IDigitalAssetValidationState {
    id: string;
    type: string;
    walletAddress: string;
    investmentTool: string;
}

export const digitalAssetsValidationState = atom<IDigitalAssetValidationState[]>({
    key: 'digitalAssetsValidationState',
    default: [{
        id: "",
        type: "",
        walletAddress: "",
        investmentTool: ""
    }]
});

export var emptyDigitalAssetValidationState: IDigitalAssetValidationState = {
    id: "",
    type: "",
    walletAddress: "",
    investmentTool: ""
};

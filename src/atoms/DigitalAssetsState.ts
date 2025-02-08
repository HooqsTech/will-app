import { atom } from 'recoil';

export interface IDigitalAssetState {
    type: string;
    walletAddress: string;
    investmentTool: string;
}

export const digitalAssetsState = atom<IDigitalAssetState[]>({
    key: 'digitalAssetsState',
    default: [{
        type: "",
        walletAddress: "",
        investmentTool: ""
    }]
});
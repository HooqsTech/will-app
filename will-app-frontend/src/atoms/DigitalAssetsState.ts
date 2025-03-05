import { atom } from 'recoil';

export interface IDigitalAssetState {
    id: string;
    type: string;
    walletAddress: string;
    investmentTool: string;
}

export const digitalAssetsState = atom<IDigitalAssetState[]>({
    key: 'digitalAssetsState',
    default: [{
        id: "",
        type: "",
        walletAddress: "",
        investmentTool: ""
    }]
});

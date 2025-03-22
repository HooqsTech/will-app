import { atom } from "recoil";

export interface IBeneficiaryDistribution{
  beneficiaryId: string;
  beneficiaryName: string;
  percentage: number;
}
export interface IAssetSelectionState{
  type: string;
  assetId: string;
  firstline: string;
  secondline : string;
  beneficiarieslist: IBeneficiaryDistribution[] | null;
  isAssetDistributed: boolean;
}

export interface IAssetDistributionSpecificState {
  id: string;
  assetSelectionList: IAssetSelectionState[];
  selectedAssets: string[];
  selectedBeneficiary: string[];
  backupBeneficiary: string[];
  additionalInputs: Record<string, string>;
  step: number;
}

export const AssetDistributionSpecificState = atom<IAssetDistributionSpecificState>({
  key: "AssetDistributionSpecificState",
  default: {
    id: "",
    assetSelectionList: [],
    selectedAssets: [],
    selectedBeneficiary: [],
    backupBeneficiary: [],
    additionalInputs: {},
    step: 1,
  },
});

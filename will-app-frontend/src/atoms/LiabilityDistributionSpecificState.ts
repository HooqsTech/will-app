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

export interface ILiabilityDistributionSpecificState {
  id: string;
  LiabilitySelectionList: IAssetSelectionState[];
  selectedLiability: string[];
  selectedBeneficiary: string[];
  backupBeneficiary: string[];
  step: number;
}

export const LiabilityDistributionSpecificState = atom<ILiabilityDistributionSpecificState>({
  key: "LiabilityDistributionSpecificState",
  default: {
    id: "",
    LiabilitySelectionList: [],
    selectedLiability: [],
    selectedBeneficiary: [],
    backupBeneficiary: [],
    step: 1,
  },
});

import { atom } from "recoil";

export interface IAssetDistributionPercentState {
  id: string;
  firstBeneficiary: string[];
  backupBeneficiary: string[];
  additionalInputs: Record<string, string>;
  step: number;
}

export const AssetDistributionPercentState = atom<IAssetDistributionPercentState>({
  key: "AssetDistributionPercentState",
  default: {
    id: "",
    firstBeneficiary: [],
    backupBeneficiary: [],
    additionalInputs: {},
    step: 1,
  },
});

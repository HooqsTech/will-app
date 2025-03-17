import { atom } from "recoil";

export interface IAssetDistributionSingleState {
  id: string;
  primaryBeneficiary: string | null;
  secondaryBeneficiary: string | null;
  tertiaryBeneficiary: string | null;
  step: number;
}

export const AssetDistributionSingleState = atom<IAssetDistributionSingleState>({
  key: "AssetDistributionSingleState",
  default: {
    id: "",
    primaryBeneficiary: null,
    secondaryBeneficiary: null,
    tertiaryBeneficiary: null,
    step: 1,
  },
});
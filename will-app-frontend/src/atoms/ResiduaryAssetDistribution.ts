import { atom } from "recoil";

export interface IResiduaryAssetDistribution {
  userId: string;
  beneficiaries: { id: string; percentage: number }[];
  firstBeneficiary: string[];
  additionalInputs: Record<string, string>;
  primaryDonation: string[]
}

export const residuaryAssetDistributionState = atom<IResiduaryAssetDistribution>({
  key: "residuaryAssetDistributionState",
  default: {
    userId: "",
    beneficiaries: [],
    firstBeneficiary: [],
    additionalInputs: {},
    primaryDonation: []
  },
});
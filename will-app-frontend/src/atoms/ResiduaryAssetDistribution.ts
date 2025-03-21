import { atom } from "recoil";

export interface IResiduaryAssetDistribution {
  userId: string;
  beneficiaries: { id: string; percentage: number }[];
}

export const residuaryAssetDistributionState = atom<IResiduaryAssetDistribution>({
  key: "residuaryAssetDistributionState",
  default: {
    userId: "",
    beneficiaries: [],
  },
});
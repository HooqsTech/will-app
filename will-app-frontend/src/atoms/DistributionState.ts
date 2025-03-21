import { atom } from "recoil";

export const DistributionState = atom<string | null>({
  key: "distributionState",
  default: null,
});

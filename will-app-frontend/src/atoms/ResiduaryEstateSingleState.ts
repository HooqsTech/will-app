import { atom } from "recoil";

export interface IResiduaryEstateSingleState {
  id: string;
  primaryBeneficiary: string[];
  donationItem: string[];
  step: number;
}

export const ResiduaryEstateSingleState = atom<IResiduaryEstateSingleState>({
  key: "ResiduaryEstateSingleState",
  default: {
    id: "",
    primaryBeneficiary: [],
    donationItem: [],
    step: 1,
  }
});
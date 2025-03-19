import { atom } from "recoil";

export interface IResiduaryEstateSingleState {
  id: string;
  primaryBeneficiary: string | null;
  donationItem: string | null;
  step: number;
}

export const ResiduaryEstateSingleState = atom<IResiduaryEstateSingleState>({
  key: "ResiduaryEstateSingleState",
  default: {
    id: "",
    primaryBeneficiary: null,
    donationItem: null,
    step: 1,
  }
});
import { atom } from "recoil";

export interface IWillDistributionState {
    id:string,
    distributionType: "Single" | "Specific" | "Percentage";
    residuaryDistributionType?: string;
    fallbackRule?: string;
}

export const willDistributionState = atom<IWillDistributionState>({
    key: "willDistributionState",
    default: {
        id: "",
        distributionType: "Single",
        residuaryDistributionType: "",
        fallbackRule: "",
    },
});
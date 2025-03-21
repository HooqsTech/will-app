import { atom } from "recoil";
import { IFormattedServiceCategory, IWillService} from "../models/willService"; // Ensure correct path

// Holds the selected category index
export const selectedCategoryState = atom<string | null>({
  key: "selectedCategoryState",
  default: null,
});

// Holds the full formatted category list
export const formattedCategoriesState = atom<IFormattedServiceCategory[]>({
  key: "formattedCategoriesState",
  default: [],
});

export const selectedServicesState = atom<IWillService[]>({
  key: "selectedServicesState",
  default: [],
});
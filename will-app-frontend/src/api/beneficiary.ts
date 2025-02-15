import { IAsset } from "../models/asset";
import { IBeneficiary } from "../models/beneficiary";

export const upsertBeneficiary = async (assetData: IBeneficiary): Promise<IBeneficiary> => {
    const response = await fetch("http://localhost:5000/api/beneficiaries/upsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetData),
    });
  
    if (!response.ok) {
      throw new Error("Failed to upsert asset");
    }
  
    const asset: IBeneficiary = await response.json();
    return asset;
  };
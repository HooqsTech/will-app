import { IBeneficiary, IBeneficiaryDeleteRequest } from "../models/beneficiary";

export const upsertBeneficiary = async (data: IBeneficiary): Promise<IBeneficiary> => {
    const response = await fetch("http://localhost:5000/api/beneficiaries/upsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error("Failed to upsert beneficiary");
    }
  
    const asset: IBeneficiary = await response.json();
    return asset;
  };

  export const deleteBeneficiary = async (data: IBeneficiaryDeleteRequest): Promise<boolean> => {
    const response = await fetch(`http://localhost:5000/api/beneficiaries/deleteById`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
  
    if (!response.ok) {
      throw new Error("Failed to delete beneficiary");
    }
  
    return true;
  };
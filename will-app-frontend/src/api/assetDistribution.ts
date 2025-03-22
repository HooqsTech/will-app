import { IWillDistributionState } from "../atoms/WillDistributionState";
import {IAssetDistributionSingleState} from "../atoms/AssetDistributionSingleState"

export const upsertWillDistribution = async (willDistribution: IWillDistributionState): Promise<IWillDistributionState> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/assetDistribution/saveAssetDistributionType`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(willDistribution),
  });

  if (!response.ok) {
    throw new Error("Failed to upsert asset");
  }

  const will: IWillDistributionState = await response.json();
  return will;
};

export const saveSingleBeneficiaryAssetDistribution = async (
    assetDistribution: IAssetDistributionSingleState
  ): Promise<IAssetDistributionSingleState> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/assetDistribution/saveSingleBeneficiaryAssetDistribution`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetDistribution),
    });
  
    if (!response.ok) {
      throw new Error("Failed to save asset distribution");
    }
  
    const savedDistribution: IAssetDistributionSingleState = await response.json();
    return savedDistribution;
  };


export const savePercentageAssetDistribution = async (
  userId: string,
  beneficiaryData: any) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/assetDistribution/savePercentageAssetDistribution`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, beneficiaryData }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save percentage-based asset distribution");
  }

  return await response.json();
};

export const saveSpecificAssetDistributionApi = async (
  userId: string,
  assetData: any
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/assetDistribution/saveSpecificAssetDistribution`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, assetData }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save specific asset distribution");
  }

  return await response.json();
};


export const saveResiduaryAssetDistributionAPI = async (userId: string, beneficiaries: { id: string; percentage: number }[]) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/assetDistribution/saveResiduaryAssetDistribution`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, beneficiaryData: beneficiaries }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save residuary asset distribution.");
    }

    return await response.json(); // Return the updated residuary distribution details
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
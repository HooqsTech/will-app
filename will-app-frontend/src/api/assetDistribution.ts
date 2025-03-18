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
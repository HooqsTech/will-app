import { IAsset, ISelectedAssets } from "../models/asset";

export const upsertAsset = async (assetData: IAsset): Promise<IAsset> => {
  const response = await fetch("http://localhost:5000/api/assets/upsert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assetData),
  });

  if (!response.ok) {
    throw new Error("Failed to upsert asset");
  }

  const asset: IAsset = await response.json();
  return asset;
};

export const addSelectedAssetsAsync = async (assetData: ISelectedAssets, userId: string): Promise<ISelectedAssets> => {
  const response = await fetch(`http://localhost:5000/api/assets/selectedAssets/${userId}/upsert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assetData),
  });

  if (!response.ok) {
    throw new Error("Failed to upsert selected asset");
  }

  const asset: ISelectedAssets = await response.json();
  return asset;
};
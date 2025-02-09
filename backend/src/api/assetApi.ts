import { AssetDetails } from '../models/userResponseModel';

// Upsert asset (Create or Update based on user_id, type, and subtype)
export const upsertAsset = async (assetData: AssetDetails): Promise<AssetDetails> => {
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

  const asset: AssetDetails = await response.json();
  return asset;
};

// Delete asset by ID
export const deleteAssetDetailsById = async (id: number): Promise<void> => {
    const response = await fetch(`http://localhost:5000/api/assets/${id}`, {
      method: "DELETE",
    });
  
    if (!response.ok) {
      throw new Error("Failed to delete asset details");
    }
  };

//Get asset by ID
export const getAssetDetailsById = async (id: number): Promise<AssetDetails | null> => {
    const response = await fetch(`http://localhost:5000/api/assets/${id}`, {
      method: "GET",
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch asset details");
    }
  
    const assetDetails: AssetDetails | null = await response.json();
    return assetDetails;
};


// Get assets with filters (user_id, type, subtype)
export const getAssetsDetails = async (filters: { user_id?: number; type?: string; subtype?: string }): Promise<AssetDetails | null> => {
    const queryParams = new URLSearchParams(filters as any).toString();
    const response = await fetch(`http://localhost:5000/api/assets?${queryParams}`, {
      method: "GET",
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch assets details");
    }
  
    const assetsDetails: AssetDetails | null = await response.json(); // Map the response to AssetDetails or null
    return assetsDetails;
};
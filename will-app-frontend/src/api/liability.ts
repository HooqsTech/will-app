import { IAsset as IAssetorLiability, ISelectedAssets } from "../models/asset";

export const upsertAsset = async (liabilityData: IAssetorLiability): Promise<IAssetorLiability> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/liabilities/upsert`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(liabilityData),
    });

    if (!response.ok) {
        throw new Error("Failed to upsert asset");
    }

    const asset: IAssetorLiability = await response.json();
    return asset;
};

export const deleteAsset = async (assetId: string): Promise<boolean> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/assets/${assetId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error("Failed to upsert asset");
    }

    return true;
};

export const addSelectedAssetsAsync = async (assetData: ISelectedAssets, userId: string): Promise<ISelectedAssets> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/assets/selectedAssets/${userId}/upsert`, {
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
import { Request, Response } from "express";
import {
    upsertSelectedAssets,
    getAssetsByUserId,
    upsertAsset,
    deleteAssetsByUserId,
    deleteAssetById,
} from "../services/assetService";
import { validUser } from '../services/userServices';


export const addSelectedAssets = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const assetData = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        if(!(await validUser(userId))){
            return res.status(400).json({ error: "Invalid User" });
        }

        const selectedAssets = await upsertSelectedAssets(userId, assetData);
        res.status(201).json(selectedAssets.data);
    } catch (error) {
        console.error("Error adding/updating selected assets:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserAssets = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== "string") {
            return res.status(400).json({ error: "User ID is required and must be a valid UUID string" });
        }

        const assets = await getAssetsByUserId(userId);
        res.status(200).json(assets);
    } catch (error) {
        console.error("Error fetching assets by user ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const upsertUserAsset = async (req: Request, res: Response) => {
    try {
        const { id, userId, type, subtype, data } = req.body;
        const asset = await upsertAsset(id, userId, type, subtype, data);
        res.status(200).json(asset);
    } catch (error) {
        console.error("Error upserting asset:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteUserAssets = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== "string") {
            return res.status(400).json({ error: "User ID is required and must be a valid UUID string" });
        }

        const deleteResult = await deleteAssetsByUserId(userId);
        if (deleteResult.count === 0) {
            return res.status(404).json({ error: "No assets found for the given user ID." });
        }

        res.status(200).json({ message: "Assets deleted successfully", deletedCount: deleteResult.count });
    } catch (error) {
        console.error("Error deleting assets by user ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteAsset = async (req: Request, res: Response) => {
    try {
        const { assetId } = req.params;

        if (!assetId || typeof assetId !== "string") {
            return res.status(400).json({ error: "Asset ID is required and must be a valid UUID string" });
        }

        const deletedAsset = await deleteAssetById(assetId);
        res.status(200).json({ message: "Asset deleted successfully", deletedAsset });
    } catch (error: any) {
        console.error("Error deleting asset by asset ID:", error);
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Asset not found for the given ID." });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

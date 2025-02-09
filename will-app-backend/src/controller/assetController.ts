import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Create Asset
export const createAsset = async (req: Request, res: Response) => {
    try {
        const { user_id, type, subtype, data } = req.body;

        const asset = await prisma.assets.create({
            data: {
                user_id,
                type,
                subtype,
                data,
            },
        });

        res.status(201).json(asset);
    } catch (error) {
        console.error("Error creating asset:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get Asset by ID
export const getAssetById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const asset = await prisma.assets.findUnique({
            where: { id: parseInt(id) },
        });

        if (!asset) {
            return res.status(404).json({ error: "Asset not found" });
        }

        res.status(200).json(asset);
    } catch (error) {
        console.error("Error fetching asset:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update Asset by ID
export const updateAssetById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { user_id, type, subtype, data } = req.body;

        const asset = await prisma.assets.update({
            where: { id: parseInt(id) },
            data: {
                user_id,
                type,
                subtype,
                data,
                updated_at: new Date(),
            },
        });

        res.status(200).json(asset);
    } catch (error) {
        console.error("Error updating asset:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete Asset by ID
export const deleteAssetById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const asset = await prisma.assets.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: "Asset deleted successfully", asset });
    } catch (error) {
        console.error("Error deleting asset:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const upsertAsset = async (req: Request, res: Response) => {
    try {
        const { id, user_id, type, subtype, data } = req.body;

        // Check if the combination of user_id, type, and subtype exists
        const existingAsset = await prisma.assets.findFirst({
            where: {
                user_id: user_id,  // Check by user_id
                type: type,        // Check by type
                subtype: subtype   // Check by subtype
            }
        });

        let asset;
        if (existingAsset) {
            // If it exists, update the asset
            asset = await prisma.assets.update({
                where: { id: existingAsset.id }, // Update by the id of the existing asset
                data: {
                    user_id,
                    type,
                    subtype,
                    data,
                    updated_at: new Date(), // Update timestamp
                },
            });
        } else {
            // If it doesn't exist, create a new asset
            asset = await prisma.assets.create({
                data: {
                    user_id,
                    type,
                    subtype,
                    data,
                    created_at: new Date(), // Ensure created_at is set
                    updated_at: new Date(), // Ensure updated_at is set
                },
            });
        }

        // Return the upserted asset
        res.status(200).json(asset);
    } catch (error) {
        console.error("Error upserting asset:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getAssets = async (req: Request, res: Response) => {
    try {
        const { user_id, type, subtype } = req.query;

        const whereClause: any = {};

        if (user_id) {
            whereClause.user_id = parseInt(user_id as string);
        }

        if (type) {
            whereClause.type = type as string;
        }

        if (subtype) {
            whereClause.subtype = subtype as string;
        }

        const assets = await prisma.assets.findMany({
            where: whereClause,
        });

        res.status(200).json(assets);
    } catch (error) {
        console.error("Error fetching assets:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getAssetsByUserId = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Fetch the assets by user_id
        const assets = await prisma.assets.findMany({
            where: {
                user_id: parseInt(user_id as string), // Ensure the user_id is an integer
            },
        });

        // Return the fetched assets as the response
        res.status(200).json(assets);
    } catch (error) {
        console.error("Error fetching assets by user_id:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
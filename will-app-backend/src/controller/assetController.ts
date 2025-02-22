import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// export const getAssetById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;

//         const asset = await prisma.assets.findUnique({
//             where: { id: parseInt(id) },
//         });

//         if (!asset) {
//             return res.status(404).json({ error: "Asset not found" });
//         }

//         res.status(200).json(asset);
//     } catch (error) {
//         console.error("Error fetching asset:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// export const updateAssetById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const { userid, type, subtype, data } = req.body;

//         const asset = await prisma.assets.update({
//             where: { id: parseInt(id) },
//             data: {
//                 userid,
//                 type,
//                 subtype,
//                 data,
//                 updatedat: new Date(),
//             },
//         });

//         res.status(200).json(asset);
//     } catch (error) {
//         console.error("Error updating asset:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// // Delete Asset by ID
// export const deleteAssetById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;

//         const asset = await prisma.assets.delete({
//             where: { id: parseInt(id) },
//         });

//         res.status(200).json({ message: "Asset deleted successfully", asset });
//     } catch (error) {
//         console.error("Error deleting asset:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// export const upsertAsset = async (req: Request, res: Response) => {
//     try {
//         const { id, userid, type, subtype, data } = req.body;

//         // Check if the combination of user_id, type, and subtype exists
//         const existingAsset = await prisma.assets.findFirst({
//             where: {
//                 userid: userid,  // Check by user_id
//                 type: type,        // Check by type
//                 subtype: subtype   // Check by subtype
//             }
//         });

//         let asset;
//         // if (existingAsset) {
//         //     // If it exists, update the asset
//         //     asset = await prisma.assets.update({
//         //         where: { id: existingAsset.id }, // Update by the id of the existing asset
//         //         data: {
//         //             userid,
//         //             type,
//         //             subtype,
//         //             data,
//         //             updatedat: new Date(), // Update timestamp
//         //         },
//         //     });
//         // } else {
//             // If it doesn't exist, create a new asset
//             asset = await prisma.assets.create({
//                 data: {
//                     userid,
//                     type,
//                     subtype,
//                     data,
//                     createdat: new Date(), // Ensure created_at is set
//                     updatedat: new Date(), // Ensure updated_at is set
//                 },
//             });
//         // }

//         // Return the upserted asset
//         res.status(200).json(asset);
//     } catch (error) {
//         console.error("Error upserting asset:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// export const getAssets = async (req: Request, res: Response) => {
//     try {
//         const { user_id, type, subtype } = req.query;

//         // Constructing the query
//         const whereClause: any = {};

//         if (user_id) {
//             const parsedUserId = parseInt(user_id as string, 10);
//             if (isNaN(parsedUserId)) {
//                 return res.status(400).json({ error: "Invalid user_id" });
//             }
//             whereClause.user_id = parsedUserId;
//         }

//         if (type) {
//             console.log(type);
//             whereClause.type = type as string;
//         }

//         if (subtype) {
//             console.log(type);
//             whereClause.subtype = subtype as string;
//         }

//         // Fetching assets based on conditions
//         const assets = await prisma.assets.findMany({
//             where: whereClause,
//         });

//         res.status(200).json(assets);
//     } catch (error) {
//         console.error("Error fetching assets:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };


export const getAssetsByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        // Validate user_id
        if (!userId || typeof userId !== "string") {
            return res.status(400).json({ error: "User ID is required and must be a valid UUID string" });
        }

        // Check if user_id is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(userId)) {
            return res.status(400).json({ error: "Invalid User ID format. Must be a valid UUID." });
        }

        // Fetch the assets by userId
        const assets = await prisma.assets.findMany({
            where: {
                userid : userId,
            },
        });

        // Return the fetched assets as the response
        res.status(200).json(assets);
    } catch (error) {
        console.error("Error fetching assets by user_id:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const upsertAsset = async (req: Request, res: Response) => {
    try {
        const { id, userId, type, subtype, data } = req.body;

        let existingAsset = null;

        if (id) {
            // If ID is provided, check if the asset exists by ID
            existingAsset = await prisma.assets.findUnique({
                where: { id },
            });
        }

        if (!existingAsset) {
            // If no asset was found by ID, check by user_id, type, and subtype
            existingAsset = await prisma.assets.findFirst({
                where: {
                    userid: userId,
                    type: type,
                    subtype: subtype
                }
            });
        }

        let asset;

        if (existingAsset) {
            // Update existing asset
            asset = await prisma.assets.update({
                where: { id: existingAsset.id },
                data: {
                    data,
                    updatedat: new Date(),
                },
            });
        } else {
            // Create new asset
            asset = await prisma.assets.create({
                data: {
                    userid : userId,
                    type,
                    subtype,
                    data,
                    createdat: new Date(),
                    updatedat: new Date(),
                },
            });
        }

        res.status(200).json(asset);
    } catch (error) {
        console.error("Error upserting asset:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteAssetsByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        // Validate user_id
        if (!userId || typeof userId !== "string") {
            return res.status(400).json({ error: "User ID is required and must be a valid UUID string" });
        }

        // Check if user_id is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(userId)) {
            return res.status(400).json({ error: "Invalid User ID format. Must be a valid UUID." });
        }

        // Delete the assets by user_id
        const deleteResult = await prisma.assets.deleteMany({
            where: {
                userid : userId, // Ensure user_id is a string UUID
            },
        });

        if (deleteResult.count === 0) {
            return res.status(404).json({ error: "No assets found for the given user ID." });
        }

        res.status(200).json({ message: "Assets deleted successfully", deletedCount: deleteResult.count });
    } catch (error) {
        console.error("Error deleting assets by user_id:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const deleteAssetById = async (req: Request, res: Response) => {
    try {
        const { assetId } = req.query;

        // Validate asset_id
        if (!assetId || typeof assetId !== "string") {
            return res.status(400).json({ error: "Asset ID is required and must be a valid UUID string" });
        }

        // Check if asset_id is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(assetId)) {
            return res.status(400).json({ error: "Invalid Asset ID format. Must be a valid UUID." });
        }

        // Delete the asset by asset_id
        const deletedAsset = await prisma.assets.delete({
            where: {
                id: assetId, // id is the primary key
            },
        });

        res.status(200).json({ message: "Asset deleted successfully", deletedAsset });
    } catch (error: any) {
        console.error("Error deleting asset by asset_id:", error);

        // Handle case where asset_id doesn't exist
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Asset not found for the given ID." });
        }

        res.status(500).json({ error: "Internal server error" });
    }
};
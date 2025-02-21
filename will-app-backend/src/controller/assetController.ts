// import { PrismaClient } from '@prisma/client';
// import { Request, Response } from 'express';

// const prisma = new PrismaClient();

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


// export const getAssetsByUserId = async (req: Request, res: Response) => {
//     try {
//         const { user_id } = req.query;

//         if (!user_id) {
//             return res.status(400).json({ error: "User ID is required" });
//         }

//         // Fetch the assets by user_id
//         const assets = await prisma.assets.findMany({
//             where: {
//                 userid: parseInt(user_id as string), // Ensure the user_id is an integer
//             },
//         });

//         // Return the fetched assets as the response
//         res.status(200).json(assets);
//     } catch (error) {
//         console.error("Error fetching assets by user_id:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// export const updateAssetByUserId = async (req: Request, res: Response) => {
//     try {
//         const { userid, type, subtype, data } = req.body;

//         if (!userid || !type || !subtype) {
//             return res.status(400).json({ error: "user_id, type, and subtype are required" });
//         }

//         // Check if the asset exists
//         const existingAsset = await prisma.assets.findFirst({
//             where: {
//                 userid,
//                 type,
//                 subtype
//             }
//         });

//         if (!existingAsset) {
//             return res.status(404).json({ error: "Asset not found" });
//         }

//         // Update the asset
//         const updatedAsset = await prisma.assets.update({
//             where: { id: existingAsset.id }, // Use the found asset's ID
//             data: {
//                 data, // Update the asset data
//                 updatedat: new Date() // Update timestamp
//             }
//         });

//         // Return the updated asset
//         res.status(200).json(updatedAsset);
//     } catch (error) {
//         console.error("Error updating asset:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

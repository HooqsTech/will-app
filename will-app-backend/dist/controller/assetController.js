"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssetById = exports.deleteAssetsByUserId = exports.upsertAsset = exports.getAssetsByUserId = exports.addSelectesAssets = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addSelectesAssets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { properties, bankAccounts, fixedDeposits, insurancePolicies, safetyDepositBoxes, dematAccounts, mutualFunds, providentFunds, pensionAccounts, businesses, bonds, debentures, esops, otherInvestments, vehicles, jewellery, digitalAssets, intellectualProperties, customAssets, } = req.body;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        // Check if user exists
        const existingUser = yield prisma.users.findUnique({
            where: { userid: userId },
        });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        // Upsert (Insert if not exists, Update if exists)
        const selectedAssets = yield prisma.selectedassets.upsert({
            where: { userid: userId },
            update: {
                data: {
                    properties,
                    bankAccounts,
                    fixedDeposits,
                    insurancePolicies,
                    safetyDepositBoxes,
                    dematAccounts,
                    mutualFunds,
                    providentFunds,
                    pensionAccounts,
                    businesses,
                    bonds,
                    debentures,
                    esops,
                    otherInvestments,
                    vehicles,
                    jewellery,
                    digitalAssets,
                    intellectualProperties,
                    customAssets,
                },
                updatedat: new Date(),
            },
            create: {
                userid: userId,
                data: {
                    properties,
                    bankAccounts,
                    fixedDeposits,
                    insurancePolicies,
                    safetyDepositBoxes,
                    dematAccounts,
                    mutualFunds,
                    providentFunds,
                    pensionAccounts,
                    businesses,
                    bonds,
                    debentures,
                    esops,
                    otherInvestments,
                    vehicles,
                    jewellery,
                    digitalAssets,
                    intellectualProperties,
                    customAssets,
                },
                createdat: new Date(),
                updatedat: new Date(),
            },
        });
        res.status(201).json(selectedAssets.data);
    }
    catch (error) {
        console.error("Error adding/updating selected assets:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.addSelectesAssets = addSelectesAssets;
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
const getAssetsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const assets = yield prisma.assets.findMany({
            where: {
                userid: userId,
            },
        });
        // Return the fetched assets as the response
        res.status(200).json(assets);
    }
    catch (error) {
        console.error("Error fetching assets by user_id:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAssetsByUserId = getAssetsByUserId;
const upsertAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId, type, subtype, data } = req.body;
        let existingAsset = null;
        if (id) {
            // If ID is provided, check if the asset exists by ID
            existingAsset = yield prisma.assets.findUnique({
                where: { id },
            });
        }
        let asset;
        if (existingAsset) {
            // Update existing asset
            asset = yield prisma.assets.update({
                where: { id: existingAsset.id },
                data: {
                    data,
                    updatedat: new Date(),
                },
            });
        }
        else {
            // Create new asset
            asset = yield prisma.assets.create({
                data: {
                    userid: userId,
                    type,
                    subtype,
                    data,
                    createdat: new Date(),
                    updatedat: new Date(),
                },
            });
        }
        res.status(200).json(asset);
    }
    catch (error) {
        console.error("Error upserting asset:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.upsertAsset = upsertAsset;
const deleteAssetsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const deleteResult = yield prisma.assets.deleteMany({
            where: {
                userid: userId, // Ensure user_id is a string UUID
            },
        });
        if (deleteResult.count === 0) {
            return res.status(404).json({ error: "No assets found for the given user ID." });
        }
        res.status(200).json({ message: "Assets deleted successfully", deletedCount: deleteResult.count });
    }
    catch (error) {
        console.error("Error deleting assets by user_id:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteAssetsByUserId = deleteAssetsByUserId;
const deleteAssetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assetId } = req.params;
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
        const deletedAsset = yield prisma.assets.delete({
            where: {
                id: assetId, // id is the primary key
            },
        });
        res.status(200).json({ message: "Asset deleted successfully", deletedAsset });
    }
    catch (error) {
        console.error("Error deleting asset by asset_id:", error);
        // Handle case where asset_id doesn't exist
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Asset not found for the given ID." });
        }
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteAssetById = deleteAssetById;

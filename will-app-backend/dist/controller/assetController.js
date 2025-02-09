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
exports.getAssetsByUserId = exports.getAssets = exports.upsertAsset = exports.deleteAssetById = exports.updateAssetById = exports.getAssetById = exports.createAsset = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create Asset
const createAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, type, subtype, data } = req.body;
        const asset = yield prisma.assets.create({
            data: {
                user_id,
                type,
                subtype,
                data,
            },
        });
        res.status(201).json(asset);
    }
    catch (error) {
        console.error("Error creating asset:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createAsset = createAsset;
// Get Asset by ID
const getAssetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const asset = yield prisma.assets.findUnique({
            where: { id: parseInt(id) },
        });
        if (!asset) {
            return res.status(404).json({ error: "Asset not found" });
        }
        res.status(200).json(asset);
    }
    catch (error) {
        console.error("Error fetching asset:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAssetById = getAssetById;
// Update Asset by ID
const updateAssetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { user_id, type, subtype, data } = req.body;
        const asset = yield prisma.assets.update({
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
    }
    catch (error) {
        console.error("Error updating asset:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateAssetById = updateAssetById;
// Delete Asset by ID
const deleteAssetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const asset = yield prisma.assets.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Asset deleted successfully", asset });
    }
    catch (error) {
        console.error("Error deleting asset:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteAssetById = deleteAssetById;
const upsertAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, user_id, type, subtype, data } = req.body;
        // Check if the combination of user_id, type, and subtype exists
        const existingAsset = yield prisma.assets.findFirst({
            where: {
                user_id: user_id, // Check by user_id
                type: type, // Check by type
                subtype: subtype // Check by subtype
            }
        });
        let asset;
        if (existingAsset) {
            // If it exists, update the asset
            asset = yield prisma.assets.update({
                where: { id: existingAsset.id }, // Update by the id of the existing asset
                data: {
                    user_id,
                    type,
                    subtype,
                    data,
                    updated_at: new Date(), // Update timestamp
                },
            });
        }
        else {
            // If it doesn't exist, create a new asset
            asset = yield prisma.assets.create({
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
    }
    catch (error) {
        console.error("Error upserting asset:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.upsertAsset = upsertAsset;
const getAssets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, type, subtype } = req.query;
        const whereClause = {};
        if (user_id) {
            whereClause.user_id = parseInt(user_id);
        }
        if (type) {
            whereClause.type = type;
        }
        if (subtype) {
            whereClause.subtype = subtype;
        }
        const assets = yield prisma.assets.findMany({
            where: whereClause,
        });
        res.status(200).json(assets);
    }
    catch (error) {
        console.error("Error fetching assets:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAssets = getAssets;
const getAssetsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        // Fetch the assets by user_id
        const assets = yield prisma.assets.findMany({
            where: {
                user_id: parseInt(user_id), // Ensure the user_id is an integer
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

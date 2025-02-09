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
exports.getAssets = exports.getAssetById = exports.deleteAssetById = exports.upsertAsset = exports.createAsset = void 0;
// Create a new asset
const createAsset = (assetData) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("http://localhost:5000/api/assets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(assetData),
    });
    if (!response.ok) {
        throw new Error("Failed to create asset");
    }
    const asset = yield response.json(); // Map the response to the Asset interface
    return asset;
});
exports.createAsset = createAsset;
// Upsert asset (Create or Update based on user_id, type, and subtype)
const upsertAsset = (assetData) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("http://localhost:5000/api/assets/upsert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(assetData),
    });
    if (!response.ok) {
        throw new Error("Failed to upsert asset");
    }
    const asset = yield response.json();
    return asset;
});
exports.upsertAsset = upsertAsset;
// Delete asset by ID
const deleteAssetById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`http://localhost:5000/api/assets/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete asset");
    }
});
exports.deleteAssetById = deleteAssetById;
// Get asset by ID
const getAssetById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`http://localhost:5000/api/assets/${id}`, {
        method: "GET",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch asset");
    }
    const asset = yield response.json(); // Map the response to the Asset interface
    return asset;
});
exports.getAssetById = getAssetById;
// Get assets with filters (user_id, type, subtype)
const getAssets = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const queryParams = new URLSearchParams(filters).toString();
    const response = yield fetch(`http://localhost:5000/api/assets?${queryParams}`, {
        method: "GET",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch assets");
    }
    const assets = yield response.json(); // Map the response to an array of Asset interfaces
    return assets;
});
exports.getAssets = getAssets;

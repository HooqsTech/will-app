"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assetController_1 = require("../controller/assetController");
const router = express_1.default.Router();
router.get("/assets/getAssetsByUserId", assetController_1.getAssetsByUserId);
router.post('/assets/upsert', assetController_1.upsertAsset);
router.post('/assets/selectedAssets/:userId/upsert', assetController_1.addSelectesAssets);
router.delete('/assets/deleteAssetsByUserId', assetController_1.deleteAssetsByUserId);
router.delete('/assets/:assetId', assetController_1.deleteAssetById);
exports.default = router;

import express from 'express';
import { upsertAsset, getAssetsByUserId, deleteAssetsByUserId, deleteAssetById, addSelectesAssets } from '../controller/assetController';

const router = express.Router();

router.get("/assets/getAssetsByUserId", getAssetsByUserId);
router.post('/assets/upsert', upsertAsset);
router.post('/assets/selectedAssets/:userId/upsert', addSelectesAssets);
router.delete('/assets/deleteAssetsByUserId', deleteAssetsByUserId);
router.delete('/assets/deleteAssetById', deleteAssetById);

export default router;
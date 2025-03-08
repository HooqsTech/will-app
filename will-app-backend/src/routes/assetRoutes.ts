import express from 'express';
import { upsertUserAsset, getUserAssets, deleteUserAssets, deleteAsset, addSelectedAssets } from '../controller/assetController';

const router = express.Router();

router.get("/assets/getAssetsByUserId", getUserAssets);
router.post('/assets/upsert', upsertUserAsset);
router.post('/assets/selectedAssets/:userId/upsert', addSelectedAssets);
router.delete('/assets/deleteAssetsByUserId', deleteUserAssets);
router.delete('/assets/:assetId', deleteAsset);

export default router;
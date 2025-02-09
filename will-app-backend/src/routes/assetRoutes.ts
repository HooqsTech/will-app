import express from 'express';
import { createAsset, getAssetById, updateAssetById, deleteAssetById, upsertAsset, getAssets , getAssetsByUserId} from '../controller/assetController';

const router = express.Router();

router.post('/assets', createAsset);
router.get('/assets/:id', getAssetById);
router.put('/assets/:id', updateAssetById);
router.delete('/assets/:id', deleteAssetById);
router.post('/assets/upsert', upsertAsset);
router.get("/assets", getAssets);
router.get("/assets", getAssetsByUserId);

export default router;

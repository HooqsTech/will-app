import express from 'express';
import { upsertAsset, getAssetsByUserId, deleteAssetsByUserId, deleteAssetById} from '../controller/assetController';

const router = express.Router();

router.get("/assets/getAssetsByUserId", getAssetsByUserId);
router.post('/assets/upsert', upsertAsset);
router.delete('/assets/deleteAssetsByUserId', deleteAssetsByUserId);
router.delete('/assets/deleteAssetById', deleteAssetById);

export default router;
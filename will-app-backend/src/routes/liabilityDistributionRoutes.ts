import express from 'express';
import { deleteLiabilityDistribution, getLiabilityDistributionByUserId, saveLiabilityDistribution } from '../controller/liabilityDistributionController';

const router = express.Router();

router.post("/liabilityDistribution/getByUserId", getLiabilityDistributionByUserId);
router.post('/liabilityDistribution/upsert', saveLiabilityDistribution);
router.delete('/liabilityDistribution/deleteByUserId', deleteLiabilityDistribution);


export default router;
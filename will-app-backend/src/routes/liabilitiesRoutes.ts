import express from 'express';
import {
    getLiabilitiesByUserId,
    getLiabilityById,
    upsertLiability,
    deleteLiabilityById,
    deleteLiabilitiesByUserId
} from '../controller/liabilitiesController';

const router = express.Router();

router.get('/liabilities/getByUserId', getLiabilitiesByUserId);
router.get('/liabilities/getById', getLiabilityById);
router.post('/liabilities/upsert', upsertLiability);
router.delete('/liabilities/:liabilityId', deleteLiabilityById);
router.delete('/liabilities/deleteByUserId', deleteLiabilitiesByUserId);

export default router;

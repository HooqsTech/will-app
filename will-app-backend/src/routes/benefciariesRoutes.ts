import express from 'express';
import {
    getBeneficiaryById,
    getBeneficiariesByUserId,
    upsertBeneficiary,
    updateBeneficiaryById,
    deleteBeneficiaryById
} from '../controller/beneficiariesController';

const router = express.Router();

router.get('/beneficiaries/:id', getBeneficiaryById);
router.get('/beneficiaries', getBeneficiariesByUserId);
router.post('/beneficiaries/upsert', upsertBeneficiary);
router.put('/beneficiaries/:id', updateBeneficiaryById);
router.delete('/beneficiaries/:id', deleteBeneficiaryById);

export default router;

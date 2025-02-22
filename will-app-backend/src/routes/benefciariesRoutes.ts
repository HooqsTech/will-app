import express from 'express';
import {
    getBeneficiaryById,
    getBeneficiariesByUserId,
    upsertBeneficiary,
    deleteBeneficiaryById,
    deleteBeneficiariesByUserId
} from '../controller/beneficiariesController';

const router = express.Router();

router.get('/beneficiaries/getByUserId', getBeneficiariesByUserId); 
router.get('/beneficiaries/getById', getBeneficiaryById); 
router.post('/beneficiaries/upsert', upsertBeneficiary); 
router.delete('/beneficiaries/deleteById', deleteBeneficiaryById); 
router.delete('/beneficiaries/deleteByUserId', deleteBeneficiariesByUserId); 

export default router;
import express from 'express';
import {
    getBeneficiaryById,
    getBeneficiariesByUserId,
    upsertBeneficiary,
    deleteBeneficiaryById,
    deleteBeneficiariesByUserId
} from '../controller/beneficiariesController';

const router = express.Router();

router.get('/executor/getByUserId', getBeneficiariesByUserId); 
router.get('/executor/getById', getBeneficiaryById); 
router.post('/executor/upsert', upsertBeneficiary); 
router.delete('/executor/deleteById', deleteBeneficiaryById); 
router.delete('/executor/deleteByUserId', deleteBeneficiariesByUserId); 

export default router;
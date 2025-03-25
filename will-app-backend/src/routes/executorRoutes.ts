import express from 'express';
import {
    getExecutorById,
    getExecutorsByUserId,
    upsertExecutor,
    deleteExecutorById,
    deleteExecutorsByUserId
} from '../controller/executorController';

const router = express.Router();

router.get('/executor/getByUserId', getExecutorsByUserId); 
router.get('/executor/getById', getExecutorById); 
router.post('/executor/upsert', upsertExecutor); 
router.delete('/executor/deleteById', deleteExecutorById); 
router.delete('/executor/deleteByUserId', deleteExecutorsByUserId); 

export default router;
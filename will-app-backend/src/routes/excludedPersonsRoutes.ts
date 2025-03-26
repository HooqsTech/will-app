import { deleteExcludedPersonById, upsertExcludedPerson } from '../controller/excludedPersonController';
import express from 'express';

const router = express.Router();

router.post('/excludedperson/upsert', upsertExcludedPerson);
router.delete('/excludedperson/deleteById', deleteExcludedPersonById);

export default router;
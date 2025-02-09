import express from 'express';
import { upsertAddressDetails, getAddressDetails, deleteAddressDetails } from '../controller/addressController';

const router = express.Router();

// Upsert address details
router.post('/address', upsertAddressDetails);

// Get address details by user_id
router.get('/address/user/:user_id', getAddressDetails);

// Delete address by ID
router.delete('/address/:id', deleteAddressDetails);

export default router;

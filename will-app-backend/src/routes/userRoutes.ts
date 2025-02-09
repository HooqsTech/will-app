import express from 'express';
import { createUser, upsertUser, deleteUserByPhone, getUserByPhone, getUserDetailsByPhone} from '../controller/userController';

const router = express.Router();

router.post('/users', createUser);
router.put('/users/upsert', upsertUser);
router.delete('/users/:phone_number', deleteUserByPhone);
router.get('/users/:phone_number', getUserByPhone);
router.get('/users/details/:phone_number', getUserDetailsByPhone); 

export default router;

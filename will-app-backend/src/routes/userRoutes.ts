import express from 'express';
import { createUser, upsertUser, deleteUserByPhone, getUserByPhone, getUserDetailsByPhone} from '../controller/userController';

const router = express.Router();

router.post('/users', createUser);
router.put('/users/upsert', upsertUser);
router.delete('/users/:phoneNumber', deleteUserByPhone);
router.get('/users/:phoneNumber', getUserByPhone);
router.get('/users/details/:phoneNumber', getUserDetailsByPhone); 

export default router;

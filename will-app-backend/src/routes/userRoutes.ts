import express from 'express';
import { createUser, deleteUserByPhone, createPersonalDetails,deletePersonalDetails} from '../controller/userController';

const router = express.Router();

router.post('/users', createUser);
router.delete('/users/:phoneNumber', deleteUserByPhone);
router.post('/users/createPersonalDetails', createPersonalDetails);
router.delete('/users/personalDetails/:userId', deletePersonalDetails);

export default router;

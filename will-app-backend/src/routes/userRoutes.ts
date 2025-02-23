import express from 'express';
import { 
    createUser, 
    deleteUserByPhone, 
    createPersonalDetails,
    deletePersonalDetails, 
    createAddressDetails, 
    deleteAddressDetails,
    getUserDetailsByPhone} from '../controller/userController';

const router = express.Router();

router.post('/users', createUser);
router.get('/users/GetbyPhoneNumber/', getUserDetailsByPhone);
router.delete('/users/:phoneNumber', deleteUserByPhone);
router.post('/users/createPersonalDetails/:userId', createPersonalDetails);
router.delete('/users/personalDetails/:userId', deletePersonalDetails);
router.post('/users/createAddressDetails/:userId', createAddressDetails);
router.delete('/users/addressDetails/:userId', deleteAddressDetails);

export default router;

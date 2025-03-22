import express from 'express';
import {
    createUserHandler,
    getUserDetailsByPhoneHandler,
    deleteUserByPhoneHandler,
    createPersonalDetailsHandler,
    deletePersonalDetailsHandler,
    createAddressDetailsHandler,
    deleteAddressDetailsHandler,
    verifyTokenAndInsertPhoneNumber,
    getUserIdByPhoneNumberHandler
} from '../controller/userController';

const router = express.Router();

router.post('/users', createUserHandler);
router.get('/users/GetbyPhoneNumber/', getUserDetailsByPhoneHandler);
router.delete('/users/:phoneNumber', deleteUserByPhoneHandler);
router.post('/users/createPersonalDetails/:userId', createPersonalDetailsHandler);
router.delete('/users/personalDetails/:userId', deletePersonalDetailsHandler);
router.post('/users/createAddressDetails/:userId', createAddressDetailsHandler);
router.delete('/users/addressDetails/:userId', deleteAddressDetailsHandler);
router.post('/users/verifyToken', verifyTokenAndInsertPhoneNumber)
router.get('/users/userId/:phoneNumber', getUserIdByPhoneNumberHandler)

export default router;

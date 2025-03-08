"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
router.post('/users', userController_1.createUser);
router.get('/users/GetbyPhoneNumber/', userController_1.getUserDetailsByPhone);
router.delete('/users/:phoneNumber', userController_1.deleteUserByPhone);
router.post('/users/createPersonalDetails/:userId', userController_1.createPersonalDetails);
router.delete('/users/personalDetails/:userId', userController_1.deletePersonalDetails);
router.post('/users/createAddressDetails/:userId', userController_1.createAddressDetails);
router.delete('/users/addressDetails/:userId', userController_1.deleteAddressDetails);
exports.default = router;

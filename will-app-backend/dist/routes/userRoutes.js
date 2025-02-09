"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
router.post('/users', userController_1.createUser);
router.put('/users/upsert', userController_1.upsertUser);
router.delete('/users/:phone_number', userController_1.deleteUserByPhone);
router.get('/users/:phone_number', userController_1.getUserByPhone);
router.get('/users/details/:phone_number', userController_1.getUserDetailsByPhone);
exports.default = router;

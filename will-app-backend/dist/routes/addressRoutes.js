"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addressController_1 = require("../controller/addressController");
const router = express_1.default.Router();
// Upsert address details
router.post('/address', addressController_1.upsertAddressDetails);
// Get address details by user_id
router.get('/address/user/:user_id', addressController_1.getAddressDetails);
// Delete address by ID
router.delete('/address/:id', addressController_1.deleteAddressDetails);
exports.default = router;

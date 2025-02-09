"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddressDetails = exports.getAddressDetails = exports.upsertAddressDetails = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const upsertAddressDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, user_id, data } = req.body;
        const address = yield prisma.address_details.upsert({
            where: { id: id || -1 },
            update: {
                user_id,
                data,
                updated_at: new Date(),
            },
            create: {
                user_id,
                data,
            },
        });
        res.status(200).json(address);
    }
    catch (error) {
        console.error("Error upserting address details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.upsertAddressDetails = upsertAddressDetails;
const getAddressDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const address = yield prisma.address_details.findMany({
            where: { user_id: parseInt(user_id) },
        });
        if (!address || address.length === 0) {
            return res.status(404).json({ error: "Address details not found" });
        }
        return res.status(200).json(address);
    }
    catch (error) {
        console.error("Error fetching address details:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAddressDetails = getAddressDetails;
const deleteAddressDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const address = yield prisma.address_details.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Address deleted successfully", address });
    }
    catch (error) {
        console.error("Error deleting address details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteAddressDetails = deleteAddressDetails;

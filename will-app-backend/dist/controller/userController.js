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
exports.getUserDetailsByPhone = exports.getUserByPhone = exports.deleteUserByPhone = exports.upsertUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const formatUserResponse_1 = require("utils/formatUserResponse");
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { full_name, father_name, phone_number, user_name, password, gender, dob, religion, aadhaar_number, } = req.body;
        const user = yield prisma.users.create({
            data: {
                full_name,
                father_name,
                phone_number,
                user_name,
                password,
                gender,
                dob: dob ? new Date(dob) : null,
                religion,
                aadhaar_number,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createUser = createUser;
const upsertUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { full_name, father_name, phone_number, user_name, password, gender, dob, religion, aadhaar_number, } = req.body;
        const user = yield prisma.users.upsert({
            where: { phone_number },
            update: { full_name, father_name, user_name, password, gender, dob: dob ? new Date(dob) : null, religion, aadhaar_number },
            create: { full_name, father_name, phone_number, user_name, password, gender, dob: dob ? new Date(dob) : null, religion, aadhaar_number },
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error upserting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.upsertUser = upsertUser;
const deleteUserByPhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone_number } = req.params;
        const user = yield prisma.users.delete({
            where: { phone_number },
        });
        res.status(200).json({ message: "User deleted successfully", user });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteUserByPhone = deleteUserByPhone;
const getUserByPhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phoneNumber = req.params.phone_number;
        const user = yield prisma.users.findUnique({
            where: { phone_number: phoneNumber },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUserByPhone = getUserByPhone;
const getUserDetailsByPhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phoneNumber = req.params.phone_number;
        const user = yield prisma.users.findUnique({
            where: { phone_number: phoneNumber },
            include: {
                address_details: true,
                assets: true,
                beneficiaries: true,
                excluded_persons: true,
                liabilities: true,
                pets: true,
            },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // Format the response
        const formattedResponse = (0, formatUserResponse_1.formatUserResponse)(user);
        res.status(200).json(formattedResponse);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUserDetailsByPhone = getUserDetailsByPhone;

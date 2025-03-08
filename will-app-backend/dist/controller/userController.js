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
exports.formatUserResponse = exports.getUserDetailsByPhone = exports.deleteAddressDetails = exports.createAddressDetails = exports.deletePersonalDetails = exports.createPersonalDetails = exports.deleteUserByPhone = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber } = req.body;
        const existingUser = yield prisma.users.findUnique({
            where: { phonenumber: phoneNumber },
        });
        if (existingUser) {
            return res.status(400).json({ error: "Phone number already exists" });
        }
        const userId = (0, uuid_1.v4)();
        const user = yield prisma.users.create({
            data: {
                userid: userId,
                phonenumber: phoneNumber,
                createdat: new Date(),
                updatedat: new Date(),
            },
        });
        res.status(201).json({ userId });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createUser = createUser;
const deleteUserByPhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber } = req.params; // Get phoneNumber from request params
        // Validate if phoneNumber is provided
        if (!phoneNumber) {
            return res.status(400).json({ error: "Phone number is required" });
        }
        // Check if user exists
        const existingUser = yield prisma.users.findUnique({
            where: { phonenumber: phoneNumber },
        });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        const userId = existingUser.userid; // Store the userId before deletion
        // Delete the user by phone number
        yield prisma.users.delete({
            where: { phonenumber: phoneNumber },
        });
        res.status(200).json({ userId });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        if (error.code === "P2025") {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteUserByPhone = deleteUserByPhone;
const createPersonalDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { fullName, fatherName, userName, password, gender, dob, religion, aadhaarNumber } = req.body;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        // Check if user exists
        const existingUser = yield prisma.users.findUnique({
            where: { userid: userId },
        });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        // Upsert (Insert if not exists, Update if exists)
        const personalDetails = yield prisma.personaldetails.upsert({
            where: { userid: userId },
            update: {
                details: {
                    fullName,
                    fatherName,
                    userName,
                    password,
                    gender,
                    dob: dob ? new Date(dob) : null,
                    religion,
                    aadhaarNumber,
                },
                updatedat: new Date(),
            },
            create: {
                userid: userId,
                details: {
                    fullName,
                    fatherName,
                    userName,
                    password,
                    gender,
                    dob: dob ? new Date(dob) : null,
                    religion,
                    aadhaarNumber,
                },
                createdat: new Date(),
                updatedat: new Date(),
            },
        });
        res.status(201).json(personalDetails.details);
    }
    catch (error) {
        console.error("Error adding/updating personal details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createPersonalDetails = createPersonalDetails;
const deletePersonalDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        // Check if the record exists
        const existingDetails = yield prisma.personaldetails.findUnique({
            where: { userid: userId },
        });
        if (!existingDetails) {
            return res.status(404).json({ error: "Personal details not found" });
        }
        // Delete the record and return deleted entry
        const deletedDetails = yield prisma.personaldetails.delete({
            where: { userid: userId },
        });
        res.status(200).json({
            personalDetailsId: deletedDetails.id
        });
    }
    catch (error) {
        console.error("Error deleting personal details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deletePersonalDetails = deletePersonalDetails;
const createAddressDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { address1, address2, pincode, city, state, phoneNumber, email } = req.body;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        // Check if user exists
        const existingUser = yield prisma.users.findUnique({
            where: { userid: userId },
        });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        // Upsert (Insert if not exists, Update if exists)
        const addressDetails = yield prisma.addressdetails.upsert({
            where: { userid: userId },
            update: {
                address: {
                    address1,
                    address2,
                    pincode,
                    city,
                    state,
                    phoneNumber,
                    email
                },
                updatedat: new Date(),
            },
            create: {
                userid: userId,
                address: {
                    address1,
                    address2,
                    pincode,
                    city,
                    state,
                    phoneNumber,
                    email
                },
                createdat: new Date(),
                updatedat: new Date(),
            },
        });
        res.status(201).json(addressDetails.address);
    }
    catch (error) {
        console.error("Error adding/updating address details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createAddressDetails = createAddressDetails;
// Delete Address Details by user_id
const deleteAddressDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        // Check if the record exists
        const existingDetails = yield prisma.addressdetails.findUnique({
            where: { userid: userId },
        });
        if (!existingDetails) {
            return res.status(404).json({ error: "Address details not found" });
        }
        // Delete the record and return deleted entry
        const deletedDetails = yield prisma.addressdetails.delete({
            where: { userid: userId },
        });
        res.status(200).json({
            addressDetailsId: deletedDetails.id
        });
    }
    catch (error) {
        console.error("Error deleting address details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteAddressDetails = deleteAddressDetails;
const getUserDetailsByPhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phoneNumber = req.query.phoneNumber;
        const user = yield prisma.users.findFirst({
            where: { phonenumber: phoneNumber },
            include: {
                addressdetails: true,
                assets: true,
                beneficiaries: true,
                excludedpersons: true,
                liabilities: true,
                personaldetails: true,
                pets: true,
                selectedassets: true,
            },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // Format the response
        const formattedResponse = (0, exports.formatUserResponse)(user);
        res.status(200).json(formattedResponse);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUserDetailsByPhone = getUserDetailsByPhone;
const formatUserResponse = (user) => {
    var _a, _b, _c;
    return {
        userId: user.userid,
        personalDetails: ((_a = user.personaldetails) === null || _a === void 0 ? void 0 : _a.details) || {},
        addressDetails: ((_b = user.addressdetails) === null || _b === void 0 ? void 0 : _b.address) || {},
        assets: user.assets.map((asset) => ({ id: asset.id, type: asset.type, subtype: asset.subtype, data: asset.data })),
        beneficiaries: user.beneficiaries.map((ben) => ({ id: ben.id, type: ben.type, data: ben.data })),
        excludedPersons: user.excludedpersons.map((ex) => ex.data),
        liabilities: user.liabilities.map((liability) => ({ id: liability.id, type: liability.type, data: liability.data })),
        pets: user.pets.map((pet) => pet.data),
        selectedAssets: ((_c = user.selectedassets) === null || _c === void 0 ? void 0 : _c.data) || {}
    };
};
exports.formatUserResponse = formatUserResponse;

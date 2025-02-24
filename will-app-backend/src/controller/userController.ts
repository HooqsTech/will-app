import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
    try {
        const { phoneNumber } = req.body;

        const existingUser = await prisma.users.findUnique({
            where: { phonenumber: phoneNumber },
        });

        if (existingUser) {
            return res.status(400).json({ error: "Phone number already exists" });
        }

        const userId = uuidv4();

        const user = await prisma.users.create({
            data: {
                userid: userId,
                phonenumber: phoneNumber,
                createdat: new Date(),
                updatedat: new Date(),
            },
        });

        res.status(201).json({ userId });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteUserByPhone = async (req: Request, res: Response) => {
    try {
        const { phoneNumber } = req.params; // Get phoneNumber from request params

        // Validate if phoneNumber is provided
        if (!phoneNumber) {
            return res.status(400).json({ error: "Phone number is required" });
        }

        // Check if user exists
        const existingUser = await prisma.users.findUnique({
            where: { phonenumber: phoneNumber },
        });

        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = existingUser.userid; // Store the userId before deletion

        // Delete the user by phone number
        await prisma.users.delete({
            where: { phonenumber: phoneNumber },
        });

        res.status(200).json({ userId });
    } catch (error: any) {
        console.error("Error deleting user:", error);

        if (error.code === "P2025") {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(500).json({ error: "Internal server error" });
    }
};

export const createPersonalDetails = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { fullName, fatherName, userName, password, gender, dob, religion, aadhaarNumber } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Check if user exists
        const existingUser = await prisma.users.findUnique({
            where: { userid: userId },
        });

        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Upsert (Insert if not exists, Update if exists)
        const personalDetails = await prisma.personaldetails.upsert({
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
    } catch (error) {
        console.error("Error adding/updating personal details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deletePersonalDetails = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Check if the record exists
        const existingDetails = await prisma.personaldetails.findUnique({
            where: { userid: userId },
        });

        if (!existingDetails) {
            return res.status(404).json({ error: "Personal details not found" });
        }

        // Delete the record and return deleted entry
        const deletedDetails = await prisma.personaldetails.delete({
            where: { userid: userId },
        });

        res.status(200).json({
            personalDetailsId: deletedDetails.id
        });
    } catch (error) {
        console.error("Error deleting personal details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createAddressDetails = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const { address1, address2, pincode, city, state, phoneNumber, email } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Check if user exists
        const existingUser = await prisma.users.findUnique({
            where: { userid: userId },
        });

        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Upsert (Insert if not exists, Update if exists)
        const addressDetails = await prisma.addressdetails.upsert({
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
    } catch (error) {
        console.error("Error adding/updating address details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete Address Details by user_id
export const deleteAddressDetails = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Check if the record exists
        const existingDetails = await prisma.addressdetails.findUnique({
            where: { userid: userId },
        });

        if (!existingDetails) {
            return res.status(404).json({ error: "Address details not found" });
        }

        // Delete the record and return deleted entry
        const deletedDetails = await prisma.addressdetails.delete({
            where: { userid: userId },
        });

        res.status(200).json({
            addressDetailsId: deletedDetails.id
        });
    } catch (error) {
        console.error("Error deleting address details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getUserDetailsByPhone = async (req: Request, res: Response): Promise<void> => {
    try {
        const phoneNumber = req.query.phoneNumber as string;

        const user = await prisma.users.findFirst({
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
        const formattedResponse = formatUserResponse(user);

        res.status(200).json(formattedResponse);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const formatUserResponse = (user: any) => {
    return {
        userId: user.userid,
        personalDetails: user.personaldetails?.details || {},
        addressDetails: user.addressdetails?.address || {},
        assets: user.assets.map((asset: any) => ({ id: asset.id, type: asset.type, subtype: asset.subtype, data: asset.data })),
        beneficiaries: user.beneficiaries.map((ben: any) => ({ id: ben.id, type: ben.type, data: ben.data })),
        excludedPersons: user.excludedpersons.map((ex: any) => ex.data),
        liabilities: user.liabilities.map((liability: any) => ({ id: liability.id, type: liability.type, data: liability.data })),
        pets: user.pets.map((pet: any) => pet.data),
        selectedAssets: user.selectedassets?.data || {}
    };
};

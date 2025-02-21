import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { User, ExcludedPerson, Pet, Beneficiary, Liability, Asset } from '../models/formatUserModel';
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
    try {
        const { phoneNumber } = req.body;

        const existingUser = await prisma.users.findUnique({
            where: { phone_number: phoneNumber },
        });

        if (existingUser) {
            return res.status(400).json({ error: "Phone number already exists" });
        }

        const userId = uuidv4();

        const user = await prisma.users.create({
            data: {
                user_id: userId,
                phone_number: phoneNumber,
                created_at: new Date(),
                updated_at: new Date(),
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
            where: { phone_number: phoneNumber },
        });

        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = existingUser.user_id; // Store the userId before deletion

        // Delete the user by phone number
        await prisma.users.delete({
            where: { phone_number: phoneNumber },
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
        const { userId, full_name, father_name, user_name, password, gender, dob, religion, aadhaar_number } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Check if user exists
        const existingUser = await prisma.users.findUnique({
            where: { user_id: userId },
        });

        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Upsert (Insert if not exists, Update if exists)
        const personalDetails = await prisma.personal_details.upsert({
            where: { user_id: userId },
            update: {
                details: {
                    full_name,
                    father_name,
                    user_name,
                    password,
                    gender,
                    dob: dob ? new Date(dob) : null,
                    religion,
                    aadhaar_number,
                },
                updated_at: new Date(),
            },
            create: {
                user_id: userId,
                details: {
                    full_name,
                    father_name,
                    user_name,
                    password,
                    gender,
                    dob: dob ? new Date(dob) : null,
                    religion,
                    aadhaar_number,
                },
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        res.status(201).json({ personalDetailsId: personalDetails.id});
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
        const existingDetails = await prisma.personal_details.findUnique({
            where: { user_id: userId },
        });

        if (!existingDetails) {
            return res.status(404).json({ error: "Personal details not found" });
        }

        // Delete the record and return deleted entry
        const deletedDetails = await prisma.personal_details.delete({
            where: { user_id: userId },
        });

        res.status(200).json({ 
            personalDetailsId: deletedDetails.id 
        });
    } catch (error) {
        console.error("Error deleting personal details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

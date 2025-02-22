import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Get a beneficiary by ID
export const getBeneficiaryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        // Validate id
        if (!id || typeof id !== "string") {
            return res.status(400).json({ error: "Beneficiary ID is required and must be a valid UUID string" });
        }

        // Check if id is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return res.status(400).json({ error: "Invalid Beneficiary ID format. Must be a valid UUID." });
        }

        const beneficiary = await prisma.beneficiaries.findUnique({
            where: { id },
        });

        if (!beneficiary) {
            return res.status(404).json({ error: "Beneficiary not found" });
        }

        res.status(200).json(beneficiary);
    } catch (error) {
        console.error("Error fetching beneficiary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all beneficiaries for a user
export const getBeneficiariesByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        // Validate userId
        if (!userId || typeof userId !== "string") {
            return res.status(400).json({ error: "User ID is required and must be a valid UUID string" });
        }

        // Check if userId is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(userId)) {
            return res.status(400).json({ error: "Invalid User ID format. Must be a valid UUID." });
        }

        const beneficiaries = await prisma.beneficiaries.findMany({
            where: { userid: userId },
        });

        res.status(200).json(beneficiaries);
    } catch (error) {
        console.error("Error fetching beneficiaries:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Create or update a beneficiary (Upsert)
export const upsertBeneficiary = async (req: Request, res: Response) => {
    try {
        const { id, userId, type, data } = req.body;

        let beneficiary;

        if (id) {
            // Check if the beneficiary exists
            const existingBeneficiary = await prisma.beneficiaries.findUnique({
                where: { id },
            });

            if (existingBeneficiary) {
                // Update if found
                beneficiary = await prisma.beneficiaries.update({
                    where: { id },
                    data: {
                        userid: userId,
                        type,
                        data,
                        updatedat: new Date(),
                    },
                });
            } else {
                // Create new if ID was given but not found
                beneficiary = await prisma.beneficiaries.create({
                    data: {
                        id, // Reuse the given ID
                        userid: userId,
                        type,
                        data,
                        createdat: new Date(),
                        updatedat: new Date(),
                    },
                });
            }
        } else {
            // Create a new beneficiary if no ID is provided
            beneficiary = await prisma.beneficiaries.create({
                data: {
                    userid: userId,
                    type,
                    data,
                    createdat: new Date(),
                    updatedat: new Date(),
                },
            });
        }

        res.status(200).json(beneficiary);
    } catch (error) {
        console.error("Error upserting beneficiary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update a beneficiary by ID
export const updateBeneficiaryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId, type, data } = req.body;

        const beneficiary = await prisma.beneficiaries.update({
            where: { id },
            data: {
                userid: userId,
                type,
                data,
                updatedat: new Date(),
            },
        });

        res.status(200).json(beneficiary);
    } catch (error) {
        console.error("Error updating beneficiary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a beneficiary by ID
export const deleteBeneficiaryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        // Validate id
        if (!id || typeof id !== "string") {
            return res.status(400).json({ error: "Beneficiary ID is required and must be a valid UUID string" });
        }

        // Check if id is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return res.status(400).json({ error: "Invalid Beneficiary ID format. Must be a valid UUID." });
        }

        // Check if the beneficiary exists before deleting
        const existingBeneficiary = await prisma.beneficiaries.findUnique({
            where: { id },
        });

        if (!existingBeneficiary) {
            return res.status(404).json({ error: "Beneficiary not found" });
        }

        // Delete the beneficiary
        const deletedBeneficiary = await prisma.beneficiaries.delete({
            where: { id },
        });

        res.status(200).json({ message: "Beneficiary deleted successfully", deletedBeneficiary });
    } catch (error) {
        console.error("Error deleting beneficiary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteBeneficiariesByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        // Validate userId
        if (!userId || typeof userId !== "string") {
            return res.status(400).json({ error: "User ID is required and must be a valid UUID string" });
        }

        // Check if userId is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(userId)) {
            return res.status(400).json({ error: "Invalid User ID format. Must be a valid UUID." });
        }

        // Check if any beneficiaries exist for the given userId
        const existingBeneficiaries = await prisma.beneficiaries.findMany({
            where: { userid: userId },
        });

        if (!existingBeneficiaries.length) {
            return res.status(404).json({ error: "No beneficiaries found for this User ID" });
        }

        // Delete all beneficiaries associated with the userId
        const deletedBeneficiaries = await prisma.beneficiaries.deleteMany({
            where: { userid: userId },
        });

        res.status(200).json({
            message: "Beneficiaries deleted successfully",
            deletedCount: deletedBeneficiaries.count,
        });
    } catch (error) {
        console.error("Error deleting beneficiaries:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
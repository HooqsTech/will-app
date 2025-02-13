import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Get a beneficiary by ID
export const getBeneficiaryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const beneficiary = await prisma.beneficiaries.findUnique({
            where: { id: parseInt(id) },
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
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const beneficiaries = await prisma.beneficiaries.findMany({
            where: {
                userid: parseInt(user_id as string),
            },
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
        const { id, userid, type, data } = req.body;

        let beneficiary;
        if (id) {
            beneficiary = await prisma.beneficiaries.update({
                where: { id },
                data: {
                    userid,
                    type,
                    data,
                    updatedat: new Date(),
                },
            });
        } else {
            beneficiary = await prisma.beneficiaries.create({
                data: {
                    userid,
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
        const { userid, type, data } = req.body;

        const beneficiary = await prisma.beneficiaries.update({
            where: { id: parseInt(id) },
            data: {
                userid,
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
        const { id } = req.params;

        const beneficiary = await prisma.beneficiaries.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: "Beneficiary deleted successfully", beneficiary });
    } catch (error) {
        console.error("Error deleting beneficiary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

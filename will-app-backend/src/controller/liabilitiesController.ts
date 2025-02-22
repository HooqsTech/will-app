import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Get a liability by ID
export const getLiabilityById = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        if (!id || typeof id !== "string" || !uuidRegex.test(id)) {
            return res.status(400).json({ error: "Invalid Liability ID. Must be a valid UUID." });
        }

        const liability = await prisma.liabilities.findUnique({ where: { id } });

        if (!liability) {
            return res.status(404).json({ error: "Liability not found" });
        }

        res.status(200).json(liability);
    } catch (error) {
        console.error("Error fetching liability:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all liabilities for a user
export const getLiabilitiesByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== "string" || !uuidRegex.test(userId)) {
            return res.status(400).json({ error: "Invalid User ID. Must be a valid UUID." });
        }

        const liabilities = await prisma.liabilities.findMany({ where: { userid: userId } });
        res.status(200).json(liabilities);
    } catch (error) {
        console.error("Error fetching liabilities:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Create or update a liability (Upsert)
export const upsertLiability = async (req: Request, res: Response) => {
    try {
        const { id, userId, type, data } = req.body;
        let liability;

        if (id) {
            const existingLiability = await prisma.liabilities.findUnique({ where: { id } });
            if (existingLiability) {
                liability = await prisma.liabilities.update({
                    where: { id },
                    data: { userid: userId, type, data, updatedat: new Date() },
                });
            } else {
                liability = await prisma.liabilities.create({
                    data: { id, userid: userId, type, data, createdat: new Date(), updatedat: new Date() },
                });
            }
        } else {
            liability = await prisma.liabilities.create({
                data: { userid: userId, type, data, createdat: new Date(), updatedat: new Date() },
            });
        }

        res.status(200).json(liability);
    } catch (error) {
        console.error("Error upserting liability:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update a liability by ID
export const updateLiabilityById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId, type, data } = req.body;

        const liability = await prisma.liabilities.update({
            where: { id },
            data: { userid: userId, type, data, updatedat: new Date() },
        });

        res.status(200).json(liability);
    } catch (error) {
        console.error("Error updating liability:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a liability by ID
export const deleteLiabilityById = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        if (!id || typeof id !== "string" || !uuidRegex.test(id)) {
            return res.status(400).json({ error: "Invalid Liability ID. Must be a valid UUID." });
        }

        const existingLiability = await prisma.liabilities.findUnique({ where: { id } });
        if (!existingLiability) {
            return res.status(404).json({ error: "Liability not found" });
        }

        await prisma.liabilities.delete({ where: { id } });
        res.status(200).json({ message: "Liability deleted successfully" });
    } catch (error) {
        console.error("Error deleting liability:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete all liabilities for a user
export const deleteLiabilitiesByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== "string" || !uuidRegex.test(userId)) {
            return res.status(400).json({ error: "Invalid User ID. Must be a valid UUID." });
        }

        const existingLiabilities = await prisma.liabilities.findMany({ where: { userid: userId } });
        if (!existingLiabilities.length) {
            return res.status(404).json({ error: "No liabilities found for this User ID" });
        }

        const deletedLiabilities = await prisma.liabilities.deleteMany({ where: { userid: userId } });
        res.status(200).json({ message: "Liabilities deleted successfully", deletedCount: deletedLiabilities.count });
    } catch (error) {
        console.error("Error deleting liabilities:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

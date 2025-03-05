import { PrismaClient } from '@prisma/client';
import { UUID } from 'crypto';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

//Check if the given user id is valid
const validUser = async (userId: UUID): Promise<boolean> => {
    const user = await prisma.users.findUnique({ where: { userid: userId } });
    return !!user;
};

//Verify ID format
const validateId = async (id: UUID): Promise<boolean> => {
    if (!id || typeof id !== "string") {
        return false;
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        return false;
    }
    return true;
}

// Get a liability by ID
export const getLiabilityById = async (request: Request, response: Response) => {
    try {
        const { id, userId } = request.body;

        if(!(await validateId(id))){
            return response.status(400).json({ error: "Invalid Liability ID format. Must be a valid UUID." });
        }
        if(!(await validateId(userId))){
            return response.status(400).json({ error: "Invalid User ID format. Must be a valid UUID." });
        }
        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }
        const liability = await prisma.liabilities.findFirst({ where: { id, userid: userId } });

        if (!liability) {
            return response.status(404).json({ error: "Liability not found" });
        }

        response.status(200).json(liability);
    } catch (error) {
        console.error("Error fetching liability:", error);
        response.status(500).json({ error: "Internal server error" });
    }
};

// Get all liabilities for a user
export const getLiabilitiesByUserId = async (request: Request, response: Response) => {
    try {
        const { userId } = request.body;
        
        if(!(await validateId(userId))){
            return response.status(400).json({ error: "Invalid User ID format. Must be a valid UUID." });
        }
        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        const liabilities = await prisma.liabilities.findMany({ where: { userid: userId } });
        response.status(200).json(liabilities);
    } catch (error) {
        console.error("Error fetching liabilities:", error);
        response.status(500).json({ error: "Internal server error" });
    }
};

// Create or update a liability (Upsert)
export const upsertLiability = async (request: Request, response: Response) => {
    try {
        const { id, userId, type, data } = request.body;
        let liability;

        if(!(await validateId(userId))){
            return response.status(400).json({ error: "Invalid User ID format. Must be a valid UUID." });
        }
        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        if (id) {
            if(!(await validateId(id))){
                return response.status(400).json({ error: "Invalid Liability ID format. Must be a valid UUID." });
            }
            const existingLiability = await prisma.liabilities.findFirst({ where: { id, userid : userId } });
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

        response.status(200).json(liability);
    } catch (error) {
        console.error("Error upserting liability:", error);
        response.status(500).json({ error: "Internal server error" });
    }
};

// Delete a liability by ID
export const deleteLiabilityById = async (request: Request, response: Response) => {
    try {
        const { id, userId } = request.body;

        if(!(await validateId(id))){
            return response.status(400).json({ error: "Invalid Liability ID format. Must be a valid UUID." });
        }
        if(!(await validateId(userId))){
            return response.status(400).json({ error: "Invalid User ID format. Must be a valid UUID." });
        }
        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        const existingLiability = await prisma.liabilities.findFirst({ where: { id, userid : userId } });
        if (!existingLiability) {
            return response.status(404).json({ error: "Liability not found" });
        }

        var deletedLiability = await prisma.liabilities.delete({ where: { id } });
        response.status(200).json({ message: "Liability deleted successfully", deletedLiability });
    } catch (error) {
        console.error("Error deleting liability:", error);
        response.status(500).json({ error: "Internal server error" });
    }
};

// Delete all liabilities for a user
export const deleteLiabilitiesByUserId = async (request: Request, response: Response) => {
    try {
        const { userId } = request.body;
        
        if(!(await validateId(userId))){
            return response.status(400).json({ error: "Invalid User ID format. Must be a valid UUID." });
        }
        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        const existingLiabilities = await prisma.liabilities.findMany({ where: { userid: userId } });
        if (!existingLiabilities.length) {
            return response.status(404).json({ error: "No liabilities found for this User ID" });
        }

        const deletedLiabilities = await prisma.liabilities.deleteMany({ where: { userid: userId } });
        response.status(200).json({ message: "Liabilities deleted successfully", deletedCount: deletedLiabilities.count });
    } catch (error) {
        console.error("Error deleting liabilities:", error);
        response.status(500).json({ error: "Internal server error" });
    }
};

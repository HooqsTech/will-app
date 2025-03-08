import { PrismaClient } from "@prisma/client";
import { UUID } from "crypto";

const prisma = new PrismaClient();

// Check if the given user ID is valid
export const validUser = async (userId: UUID): Promise<boolean> => {
    const user = await prisma.users.findUnique({ where: { userid: userId } });
    return !!user;
};

// Verify ID format
export const validateId = async (id: UUID): Promise<boolean> => {
    if (!id || typeof id !== "string") {
        return false;
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

// Get a liability by ID
export const getLiabilityByIdService = async (id: UUID, userId: UUID) => {
    return await prisma.liabilities.findFirst({ where: { id, userid: userId } });
};

// Get all liabilities for a user
export const getLiabilitiesByUserIdService = async (userId: UUID) => {
    return await prisma.liabilities.findMany({ where: { userid: userId } });
};

// Create or update (upsert) a liability
export const upsertLiabilityService = async (id: UUID | null, userId: UUID, type: string, data: any) => {
    if (id) {
        // Check if liability exists
        const existingLiability = await prisma.liabilities.findFirst({ where: { id, userid: userId } });
        if (existingLiability) {
            return await prisma.liabilities.update({
                where: { id },
                data: { userid: userId, type, data, updatedat: new Date() },
            });
        }
        // Create new if ID was given but not found
        return await prisma.liabilities.create({
            data: { id, userid: userId, type, data, createdat: new Date(), updatedat: new Date() },
        });
    }
    // Create new liability if no ID is provided
    return await prisma.liabilities.create({
        data: { userid: userId, type, data, createdat: new Date(), updatedat: new Date() },
    });
};

// Delete a liability by ID
export const deleteLiabilityByIdService = async (id: UUID) => {
    return await prisma.liabilities.delete({ where: { id } });
};

// Delete all liabilities for a user
export const deleteLiabilitiesByUserIdService = async (userId: UUID) => {
    return await prisma.liabilities.deleteMany({ where: { userid: userId } });
};

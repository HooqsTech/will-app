import { PrismaClient } from '@prisma/client';
import { UUID } from 'crypto';

const prisma = new PrismaClient();

// Verify ID format
export const validateId = async (id: UUID): Promise<boolean> => {
    if (!id || typeof id !== "string") {
        return false;
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

// Get a beneficiary by ID
export const getExecutorByIdService = async (id: UUID, userId: UUID) => {
    return await prisma.executors.findFirst({ where: { id, userid: userId } });
};

// Get all beneficiaries for a user
export const getExecutorsByUserIdService = async (userId: UUID) => {
    return await prisma.executors.findMany({ where: { userid: userId } });
};

// Create or update (upsert) a beneficiary
export const upsertExecutorService = async (id: UUID | null, userId: UUID, data: any) => {
    if (id) {
        // Check if beneficiary exists
        const existingBeneficiary = await prisma.executors.findFirst({ where: { id, userid: userId } });
        if (existingBeneficiary) {
            return await prisma.executors.update({
                where: { id },
                data: { userid: userId, data, updatedat: new Date() },
            });
        }
        // Create new if ID was given but not found
        return await prisma.executors.create({
            data: { id, userid: userId, data, createdat: new Date(), updatedat: new Date() },
        });
    }
    // Create new beneficiary if no ID is provided
    return await prisma.executors.create({
        data: { userid: userId, data, createdat: new Date(), updatedat: new Date() },
    });
};

// Delete a beneficiary by ID
export const deleteExecutorByIdService = async (id: UUID) => {
    return await prisma.executors.delete({ where: { id } });
};

// Delete all beneficiaries for a user
export const deleteExecutorsByUserIdService = async (userId: UUID) => {
    return await prisma.executors.deleteMany({ where: { userid: userId } });
};
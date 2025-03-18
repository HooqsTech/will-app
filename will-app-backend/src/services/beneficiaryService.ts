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
export const getBeneficiaryByIdService = async (id: UUID, userId: UUID) => {
    return await prisma.beneficiaries.findFirst({ where: { id, userid: userId } });
};

// Get all beneficiaries for a user
export const getBeneficiariesByUserIdService = async (userId: UUID) => {
    return await prisma.beneficiaries.findMany({ where: { userid: userId } });
};

// Create or update (upsert) a beneficiary
export const upsertBeneficiaryService = async (id: UUID | null, userId: UUID, type: string, data: any) => {
    if (id) {
        // Check if beneficiary exists
        const existingBeneficiary = await prisma.beneficiaries.findFirst({ where: { id, userid: userId } });
        if (existingBeneficiary) {
            return await prisma.beneficiaries.update({
                where: { id },
                data: { userid: userId, type, data, updatedat: new Date() },
            });
        }
        // Create new if ID was given but not found
        return await prisma.beneficiaries.create({
            data: { id, userid: userId, type, data, createdat: new Date(), updatedat: new Date() },
        });
    }
    // Create new beneficiary if no ID is provided
    return await prisma.beneficiaries.create({
        data: { userid: userId, type, data, createdat: new Date(), updatedat: new Date() },
    });
};

// Delete a beneficiary by ID
export const deleteBeneficiaryByIdService = async (id: UUID) => {
    return await prisma.beneficiaries.delete({ where: { id } });
};

// Delete all beneficiaries for a user
export const deleteBeneficiariesByUserIdService = async (userId: UUID) => {
    return await prisma.beneficiaries.deleteMany({ where: { userid: userId } });
};
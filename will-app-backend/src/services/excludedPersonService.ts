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

// Create or update (upsert) a excluded person
export const upsertExcludedPersonService = async (id: UUID | null, userId: UUID, data: any) => {
    if (id) {
        // Check if beneficiary exists
        const existingRecord = await prisma.excludedpersons.findFirst({ where: { id, userid: userId } });
        if (existingRecord) {
            return await prisma.excludedpersons.update({
                where: { id },
                data: { userid: userId, data, updatedat: new Date() },
            });
        }
        // Create new if ID was given but not found
        return await prisma.excludedpersons.create({
            data: { id, userid: userId, data, createdat: new Date(), updatedat: new Date() },
        });
    }
    // Create new beneficiary if no ID is provided
    return await prisma.excludedpersons.create({
        data: { userid: userId, data, createdat: new Date(), updatedat: new Date() },
    });
};

// Delete a beneficiary by ID
export const deleteExcludedPersonByIdService = async (id: UUID) => {
    return await prisma.excludedpersons.delete({ where: { id } });
};
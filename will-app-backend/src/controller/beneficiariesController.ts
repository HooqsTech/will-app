import { PrismaClient } from '@prisma/client';
import { UUID } from 'crypto';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

//Check if the given user id is valid
const validUser = async (userId: UUID): Promise<boolean> => {
    const user = await prisma.users.findUnique({ where: { userid: userId } });
    return !!user;
};

//Check if the given beneficairy id exists and is valid for the user
const validBeneficiary = async (id: UUID, userId: UUID): Promise<boolean> => {
    const beneficiary = await prisma.beneficiaries.findFirst({ where: { id, userid: userId } });
    return !!beneficiary;
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

// Get a beneficiary by ID
export const getBeneficiaryById = async (request: Request, response: Response) => {
    try {
        const { userId, id } = request.body;

        if(!(await validateId(id))){
            return response.status(400).json({ error: "Invalid Beneficiary ID format. Must be a valid UUID." });
        }
        if(!(await validateId(userId))){
            return response.status(400).json({ error: "Invalid User ID format. Must be a valid UUID." });
        }
        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        const beneficiary = await prisma.beneficiaries.findFirst({
            where: { id , userid: userId },
        });

        if (!beneficiary) {
            return response.status(404).json({ error: "Beneficiary not found" });
        }

        response.status(200).json(beneficiary);
    } catch (error) {
        console.error("Error fetching beneficiary:", error);
        response.status(500).json({ error: "Internal server error" });
    }
};

// Get all beneficiaries for a user
export const getBeneficiariesByUserId = async (request: Request, response: Response) => {
    try {
        const { userId } = request.body;

        if(!(await validateId(userId))){
            return response.status(400).json({ error: "Invalid User ID format. Must be a valid UUID." });
        }
        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        const beneficiaries = await prisma.beneficiaries.findMany({
            where: { userid: userId },
        });

        response.status(200).json(beneficiaries);
    } catch (error) {
        console.error("Error fetching beneficiaries:", error);
        response.status(500).json({ error: "Internal server error" });
    }
};

// Create or update a beneficiary (Upsert)
export const upsertBeneficiary = async (request: Request, response: Response) => {
    try {
        const { id, userId, type, data } = request.body;

        
        if(!(await validateId(userId))){
            return response.status(400).json({ error: "Invalid User ID format. Must be a valid UUID." });
        }
        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        let beneficiary;

        if (id) {
            if(!(await validateId(id))){
                return response.status(400).json({ error: "Invalid Beneficiary ID format. Must be a valid UUID." });
            }
            // Check if the beneficiary exists
            const existingBeneficiary = await prisma.beneficiaries.findFirst({
                where: { id, userid : userId },
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

        response.status(200).json(beneficiary);
    } catch (error) {
        console.error("Error upserting beneficiary:", error);
        response.status(500).json({ error: "Internal server error" });
    }
};

// Delete a beneficiary by ID
export const deleteBeneficiaryById = async (request: Request, response: Response) => {
    try {
        const { id, userId } = request.body;

        if(!(await validateId(id))){
            return response.status(400).json({ error: "Invalid Beneficiary ID format. Must be a valid UUID." });
        }
        if(!(await validateId(userId))){
            return response.status(400).json({ error: "Invalid User ID format. Must be a valid UUID." });
        }
        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        // Check if the beneficiary exists before deleting
        const existingBeneficiary = await prisma.beneficiaries.findFirst({
            where: { id, userid : userId },
        });

        if (!existingBeneficiary) {
            return response.status(404).json({ error: "Beneficiary not found" });
        }

        // Delete the beneficiary
        const deletedBeneficiary = await prisma.beneficiaries.delete({
            where: { id },
        });

        response.status(200).json({ message: "Beneficiary deleted successfully", deletedBeneficiary });
    } catch (error) {
        console.error("Error deleting beneficiary:", error);
        response.status(500).json({ error: "Internal server error" });
    }
};

export const deleteBeneficiariesByUserId = async (request: Request, response: Response) => {
    try {
        const { userId } = request.body;

        if(!(await validateId(userId))){
            return response.status(400).json({ error: "Invalid User ID format. Must be a valid UUID." });
        }
        if(!(await validUser(userId))){
            return response.status(400).json({ error: "Invalid User" });
        }

        // Check if any beneficiaries exist for the given userId
        const existingBeneficiaries = await prisma.beneficiaries.findMany({
            where: { userid: userId },
        });

        if (!existingBeneficiaries.length) {
            return response.status(404).json({ error: "No beneficiaries found for this User ID" });
        }

        // Delete all beneficiaries associated with the userId
        const deletedBeneficiaries = await prisma.beneficiaries.deleteMany({
            where: { userid: userId },
        });

        response.status(200).json({
            message: "Beneficiaries deleted successfully",
            deletedCount: deletedBeneficiaries.count,
        });
    } catch (error) {
        console.error("Error deleting beneficiaries:", error);
        response.status(500).json({ error: "Internal server error" });
    }
};
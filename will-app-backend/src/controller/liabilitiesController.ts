import { Request, Response } from "express";
import { 
    validateId, 
    getLiabilityByIdService, 
    getLiabilitiesByUserIdService, 
    upsertLiabilityService, 
    deleteLiabilityByIdService, 
    deleteLiabilitiesByUserIdService 
} from "../services/liabilityService";

import { UUID } from "crypto";

// Get liability by ID
export const getLiabilityById = async (req: Request, res: Response) => {
    try {
        const { id, userId } = req.params as { id: UUID; userId: UUID };

        if (!validateId(id) || !validateId(userId)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const liability = await getLiabilityByIdService(id, userId);
        if (!liability) {
            return res.status(404).json({ error: "Liability not found" });
        }

        res.json(liability);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all liabilities for a user
export const getLiabilitiesByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params as { userId: UUID };

        if (!validateId(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        const liabilities = await getLiabilitiesByUserIdService(userId);
        res.json(liabilities);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Create or update liability
export const upsertLiability = async (req: Request, res: Response) => {
    try {
        const { id, userId, type, data } = req.body as { id?: UUID; userId: UUID; type: string; data: any };

        if (!validateId(userId) || (id && !validateId(id))) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const liability = await upsertLiabilityService(id ?? null, userId, type, data);
        res.status(201).json(liability);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete liability by ID
export const deleteLiabilityById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: UUID };

        if (!validateId(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        await deleteLiabilityByIdService(id);
        res.status(200).json({ message: "Liability deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete all liabilities for a user
export const deleteLiabilitiesByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params as { userId: UUID };

        if (!validateId(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        await deleteLiabilitiesByUserIdService(userId);
        res.status(200).json({ message: "All liabilities deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

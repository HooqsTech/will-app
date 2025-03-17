import { Request, Response } from 'express';
import {
    validateId,
    getBeneficiaryByIdService,
    getBeneficiariesByUserIdService,
    upsertBeneficiaryService,
    deleteBeneficiaryByIdService,
    deleteBeneficiariesByUserIdService
} from '../services/beneficiaryService';
import { validUser } from '../services/userServices';


export const getBeneficiaryById = async (req: Request, res: Response) => {
    try {
        const { userId, id } = req.body;

        if (!(await validateId(id))) return res.status(400).json({ error: "Invalid Beneficiary ID format." });
        if (!(await validateId(userId))) return res.status(400).json({ error: "Invalid User ID format." });
        if (!(await validUser(userId))) return res.status(400).json({ error: "Invalid User" });

        const beneficiary = await getBeneficiaryByIdService(id, userId);
        if (!beneficiary) return res.status(404).json({ error: "Beneficiary not found" });

        res.status(200).json(beneficiary);
    } catch (error) {
        console.error("Error fetching beneficiary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getBeneficiariesByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (!(await validateId(userId))) return res.status(400).json({ error: "Invalid User ID format." });
        if (!(await validUser(userId))) return res.status(400).json({ error: "Invalid User" });

        const beneficiaries = await getBeneficiariesByUserIdService(userId);
        res.status(200).json(beneficiaries);
    } catch (error) {
        console.error("Error fetching beneficiaries:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const upsertBeneficiary = async (req: Request, res: Response) => {
    try {
        const { id, userId, type, data } = req.body;

        if (!(await validateId(userId))) return res.status(400).json({ error: "Invalid User ID format." });
        if (!(await validUser(userId))) return res.status(400).json({ error: "Invalid User" });
        if (id && !(await validateId(id))) return res.status(400).json({ error: "Invalid Beneficiary ID format." });

        const beneficiary = await upsertBeneficiaryService(id, userId, type, data);
        res.status(200).json(beneficiary);
    } catch (error) {
        console.error("Error upserting beneficiary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteBeneficiaryById = async (req: Request, res: Response) => {
    try {
        const { id, userId } = req.body;

        if (!(await validateId(id))) return res.status(400).json({ error: "Invalid Beneficiary ID format." });
        if (!(await validateId(userId))) return res.status(400).json({ error: "Invalid User ID format." });
        if (!(await validUser(userId))) return res.status(400).json({ error: "Invalid User" });

        await deleteBeneficiaryByIdService(id);
        res.status(200).json({ message: "Beneficiary deleted successfully" });
    } catch (error) {
        console.error("Error deleting beneficiary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete all beneficiaries for a user
export const deleteBeneficiariesByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (!(await validateId(userId))) return res.status(400).json({ error: "Invalid User ID format." });
        if (!(await validUser(userId))) return res.status(400).json({ error: "Invalid User" });

        const deletedBeneficiaries = await deleteBeneficiariesByUserIdService(userId);
        res.status(200).json({
            message: "Beneficiaries deleted successfully",
            deletedCount: deletedBeneficiaries.count,
        });
    } catch (error) {
        console.error("Error deleting beneficiaries:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

import { Request, Response } from 'express';
import { deleteExcludedPersonByIdService, upsertExcludedPersonService } from '../services/excludedPersonService';
import {
    validateId
} from '../services/executorService';
import { validUser } from '../services/userServices';

export const upsertExcludedPerson = async (req: Request, res: Response) => {
    try {
        const { id, userId, data } = req.body;

        if (!(await validateId(userId))) return res.status(400).json({ error: "Invalid User ID format." });
        if (!(await validUser(userId))) return res.status(400).json({ error: "Invalid User" });
        if (id && !(await validateId(id))) return res.status(400).json({ error: "Invalid excluded person ID format." });

        const executor = await upsertExcludedPersonService(id, userId, data);
        res.status(200).json(executor);
    } catch (error) {
        console.error("Error upserting excluded person:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteExcludedPersonById = async (req: Request, res: Response) => {
    try {
        const { id, userId } = req.body;

        if (!(await validateId(id))) return res.status(400).json({ error: "Invalid Executor ID format." });
        if (!(await validateId(userId))) return res.status(400).json({ error: "Invalid User ID format." });
        if (!(await validUser(userId))) return res.status(400).json({ error: "Invalid User" });

        await deleteExcludedPersonByIdService(id);
        res.status(200).json({ message: "Excluded person deleted successfully" });
    } catch (error) {
        console.error("Error deleting Executor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

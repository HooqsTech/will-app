import { Request, Response } from 'express';
import {
    validateId,
    getExecutorByIdService,
    getExecutorsByUserIdService,
    upsertExecutorService,
    deleteExecutorByIdService,
    deleteExecutorsByUserIdService
} from '../services/executorService';
import { validUser } from '../services/userServices';


export const getExecutorById = async (req: Request, res: Response) => {
    try {
        const { userId, id } = req.body;

        if (!(await validateId(id))) return res.status(400).json({ error: "Invalid Executor ID format." });
        if (!(await validateId(userId))) return res.status(400).json({ error: "Invalid User ID format." });
        if (!(await validUser(userId))) return res.status(400).json({ error: "Invalid User" });

        const executor = await getExecutorByIdService(id, userId);
        if (!executor) return res.status(404).json({ error: "Executor not found" });

        res.status(200).json(executor);
    } catch (error) {
        console.error("Error fetching Executor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getExecutorsByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (!(await validateId(userId))) return res.status(400).json({ error: "Invalid User ID format." });
        if (!(await validUser(userId))) return res.status(400).json({ error: "Invalid User" });

        const executors = await getExecutorsByUserIdService(userId);
        res.status(200).json(executors);
    } catch (error) {
        console.error("Error fetching executors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const upsertExecutor = async (req: Request, res: Response) => {
    try {
        const { id, userId, type, data } = req.body;

        if (!(await validateId(userId))) return res.status(400).json({ error: "Invalid User ID format." });
        if (!(await validUser(userId))) return res.status(400).json({ error: "Invalid User" });
        if (id && !(await validateId(id))) return res.status(400).json({ error: "Invalid Executor ID format." });

        const executor = await upsertExecutorService(id, userId, data);
        res.status(200).json(executor);
    } catch (error) {
        console.error("Error upserting executor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteExecutorById = async (req: Request, res: Response) => {
    try {
        const { id, userId } = req.body;

        if (!(await validateId(id))) return res.status(400).json({ error: "Invalid Executor ID format." });
        if (!(await validateId(userId))) return res.status(400).json({ error: "Invalid User ID format." });
        if (!(await validUser(userId))) return res.status(400).json({ error: "Invalid User" });

        await deleteExecutorByIdService(id);
        res.status(200).json({ message: "Executor deleted successfully" });
    } catch (error) {
        console.error("Error deleting Executor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete all executors for a user
export const deleteExecutorsByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (!(await validateId(userId))) return res.status(400).json({ error: "Invalid User ID format." });
        if (!(await validUser(userId))) return res.status(400).json({ error: "Invalid User" });

        const deletedExecutors = await deleteExecutorsByUserIdService(userId);
        res.status(200).json({
            message: "Executors deleted successfully",
            deletedCount: deletedExecutors.count,
        });
    } catch (error) {
        console.error("Error deleting executors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

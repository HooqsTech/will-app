import { Request, Response } from "express";
import {
    getAllWillServices,
    getWillServiceById,
    upsertWillService,
    deleteWillServiceById,
    upsertServiceCategory,
    deleteServiceCategoryById
} from "../services/willService";

// Get all will services grouped by categories
export const getWillServices = async (req: Request, res: Response) => {
    try {
        const services = await getAllWillServices();
        res.json(services);
    } catch (error) {
        console.error("Error fetching will services:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get will service by ID
export const getWillService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const service = await getWillServiceById(id);
        if (!service) {
            return res.status(404).json({ error: "Service not found" });
        }
        res.json(service);
    } catch (error) {
        console.error("Error fetching will service by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Create or update a will service
export const upsertWillServiceController = async (req: Request, res: Response) => {
    try {
        const { id, categoryId, serviceName, standardPrice, discountedPrice } = req.body;

        if (!categoryId || !serviceName) {
            return res.status(400).json({ error: "Category ID and Service Name cannot be empty." });
        }

        const service = await upsertWillService(id || null, categoryId, serviceName, standardPrice, discountedPrice);
        res.status(201).json(service);
    } catch (error) {
        console.error("Error in upsertWillServiceController:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Create or update a service category
export const upsertServiceCategoryController = async (req: Request, res: Response) => {
    try {
        const { id, categoryName, description, standardPrice, discountedPrice } = req.body;

        if (!categoryName) {
            return res.status(400).json({ error: "Category Name cannot be empty." });
        }

        const category = await upsertServiceCategory(id || null, categoryName, description, standardPrice, discountedPrice);
        res.status(201).json(category);
    } catch (error) {
        console.error("Error in upsertServiceCategoryController:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a will service by ID
export const deleteWillService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteWillServiceById(id);
        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error("Error deleting will service:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a service category by ID
export const deleteServiceCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteServiceCategoryById(id);
        res.status(200).json({ message: "Service category deleted successfully" });
    } catch (error) {
        console.error("Error deleting service category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
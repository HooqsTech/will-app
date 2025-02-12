import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const upsertAddressDetails = async (req: Request, res: Response) => {
    try {
        const { id, user_id, data } = req.body;
        const address = await prisma.address_details.upsert({
            where: { id: id || -1 },
            update: {
                user_id,
                data,
                updated_at: new Date(),
            },
            create: {
                user_id,
                data,
            },
        });
        res.status(200).json(address);
    } catch (error) {
        console.error("Error upserting address details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAddressDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { user_id } = req.params;
        const address = await prisma.address_details.findMany({
            where: { user_id: parseInt(user_id) },
        });

        if (!address || address.length === 0) {
            return res.status(404).json({ error: "Address details not found" });
        }

        return res.status(200).json(address);
    } catch (error) {
        console.error("Error fetching address details:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteAddressDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        await prisma.address_details.delete({  where: { id: parseInt(id) }});

        res.status(200).json({ message: "Address deleted successfully"});
    } catch (error) {
        console.error("Error deleting address details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



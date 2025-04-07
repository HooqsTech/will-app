import { Request, Response } from "express";
import { validUser } from "../services/userServices";
import { getPDFVersioningByUserId, getPDFVersioningByUserIdAndVersionId , getAllPDFVersioningByUserId} from "../services/pdfVersioningService";
import axios from "axios";

export const downloadPDF = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: "UserId is required" });
        }
        if (!(await validUser(userId))) {
            return res.status(400).json({ error: "Invalid User" });
        }

        var pdfDetails = await getPDFVersioningByUserId(userId);
        if (!pdfDetails || !pdfDetails.downloadurl) {
            return res.status(404).json({ error: "No PDF found for this user" });
        }

        const response = await axios.get(pdfDetails.downloadurl, { responseType: "stream" });

        res.setHeader("Content-Disposition", `attachment; filename="document.pdf"`);
        res.setHeader("Content-Type", "application/pdf");

        response.data.pipe(res);

    } catch (error) {
        console.error("Error downloading pdf:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getPdfVersionByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: "UserId is required" });
        }
        if (!(await validUser(userId))) {
            return res.status(400).json({ error: "Invalid User" });
        }

        var pdfDetails = await getAllPDFVersioningByUserId(userId);
        if (!pdfDetails) {
            return res.status(404).json({ error: "No PDF found for this user" });
        }

        return res.status(201).json({ pdfverisoning: pdfDetails });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};


export const downloadPDFByuserIdAndVersionId = async (req: Request, res: Response) => {
    try {
        const { userId , versioId} = req.body;
        if (!userId) {
            return res.status(400).json({ error: "UserId is required" });
        }
        if (!(await validUser(userId))) {
            return res.status(400).json({ error: "Invalid User" });
        }

        var pdfDetails = await getPDFVersioningByUserIdAndVersionId(userId, versioId);
        if (!pdfDetails || !pdfDetails.downloadurl) {
            return res.status(404).json({ error: "No PDF found for this user" });
        }

        const response = await axios.get(pdfDetails.downloadurl, { responseType: "stream" });

        res.setHeader("Content-Disposition", `attachment; filename="document.pdf"`);
        res.setHeader("Content-Type", "application/pdf");

        response.data.pipe(res);

    } catch (error) {
        console.error("Error downloading pdf:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
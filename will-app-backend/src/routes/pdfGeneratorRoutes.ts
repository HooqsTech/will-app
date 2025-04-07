import express from 'express';
import { generatePDF } from '../controller/pdfGenerator';
import { downloadPDF, getPdfVersionByUserId, downloadPDFByuserIdAndVersionId } from '../controller/pdfDowloader';

const router = express.Router();

router.post('/generatePDF', generatePDF);
router.post('/downloadPDF', downloadPDF);
router.post('/pdfversionByUserId', getPdfVersionByUserId)
router.post('/downloadPdfByUserIdAndVersionId', downloadPDFByuserIdAndVersionId)

export default router;

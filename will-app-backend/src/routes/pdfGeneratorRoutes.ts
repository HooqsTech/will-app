import express from 'express';
import { generatePDF} from '../controller/pdfGenerator';
import { downloadPDF } from '../controller/pdfDowloader';

const router = express.Router();

router.post('/generatePDF', generatePDF);
router.post('/downloadPDF', downloadPDF);


export default router;

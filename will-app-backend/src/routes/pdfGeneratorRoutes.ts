import express from 'express';
import { generatePDF} from '../controller/pdfGenerator';

const router = express.Router();

router.post('/generatePDF', generatePDF);

export default router;

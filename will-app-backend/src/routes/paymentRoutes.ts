import express from 'express';

import {
    createPaymentOrder,
    recordPaymentEvent,
} from '../controller/paymentController';

const router = express.Router();

router.post('/payments/events', recordPaymentEvent);
router.post('/payments', createPaymentOrder);

export default router;

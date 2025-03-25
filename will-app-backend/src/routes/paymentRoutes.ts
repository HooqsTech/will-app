import express from 'express';

import {
    createPaymentOrder,
    recordPaymentEvent,createOrUpdatePaymentTransaction, getPaymentTransactions
} from '../controller/paymentController';

const router = express.Router();

router.post('/payments/events', recordPaymentEvent);
router.post('/payments', createPaymentOrder);
router.post('/payments/transactions', createOrUpdatePaymentTransaction);
router.get('/payments/transactions/:userId', getPaymentTransactions);

export default router;

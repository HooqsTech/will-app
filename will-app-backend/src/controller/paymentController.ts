import { IRazorPaymentDetails } from "models/paymentDetails";
import { Request, Response } from "express";
import Razorpay from "razorpay";
import { insertPaymentEvent, insertPaymentOrder, updateRazorIdToPaymentOrder, upsertPaymentTransaction, getPaymentTransactionsByUserId } from "../services/paymentServices";
import { calculateTotalPrice } from "../services/willService";

export const recordPaymentEvent = async (req: Request, res: Response) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    try {
        const body: IRazorPaymentDetails = await req.body;

        // VERIFICATION AUTHENTICITY
        const crypto = require("crypto");
        const shasum = crypto.createHmac('sha256', secret)
        shasum.update(JSON.stringify(body))
        const digest = shasum.digest('hex')

        console.log('body', JSON.stringify(body))

        if (digest !== req.headers["x-razorpay-signature"]) {
            return res.status(401).json("Un authorized");
        }

        await insertPaymentEvent(
            body.event,
            JSON.stringify(body.payload) ?? "",
            body.payload.payment.entity.order_id ?? ""
        )

        res.status(201).json(JSON.stringify(body));
    } catch (error) {

        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createPaymentOrder = async (req: Request, res: Response) => {
    try {
        const { userId, serviceIds, categoryId }: 
        { userId?: string, serviceIds?: string[], categoryId?: string } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        if (!categoryId) {
            return res.status(400).json({ error: "Category ID is required" });
        }

        // Calculate total price with category discount
        let totalAmount = await calculateTotalPrice(categoryId, serviceIds );

        if (totalAmount <= 0) {
            return res.status(400).json({ error: "Total amount must be greater than zero" });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZOR_PAY_ID ?? "",
            key_secret: process.env.RAZOR_PAY_SECRET ?? ""
        });

        // Capture payment amount
        const payment_capture = 1;

        // Create a payment order in DB
        const paymentOrder = await insertPaymentOrder(userId, totalAmount);

        // Razorpay order options
        const options = {
            amount: totalAmount * 100,  // Convert to paise
            currency: "INR",
            receipt: paymentOrder.orderid,
            payment_capture
        };

        // Create Razorpay order
        const response = await razorpay.orders.create(options);

        // Update Razorpay Order ID in DB
        await updateRazorIdToPaymentOrder(paymentOrder.orderid, response.id);

        // Return response
        res.status(201).json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
        });
    } catch (error) {
        console.error("Error in createPaymentOrder:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createOrUpdatePaymentTransaction = async (req: Request, res: Response) => {
    try {
        const { orderId, userId, selectedServices, selectedCategories }:
        { orderId?: string, userId?: string, selectedServices?: any, selectedCategories?: any } = req.body;

        if (!orderId) {
            return res.status(400).json({ error: "Order ID is required" });
        }

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        if (!selectedCategories) {
            return res.status(400).json({ error: "Category ID is required" });
        }

        // Extract service IDs from selectedServices
        const selectedServiceIds = selectedServices.map((service: any) => service.serviceId);

        const categoryId = selectedCategories?.categoryId;
        // Calculate total price including category discount
        const totalPrice = await calculateTotalPrice(categoryId, selectedServiceIds);

        // Perform upsert operation
        const transaction = await upsertPaymentTransaction(orderId, userId, selectedServices, totalPrice, selectedCategories);

        res.status(201).json({
            transaction
        });
    } catch (error) {
        console.error("Error in createOrUpdatePaymentTransaction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getPaymentTransactions = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const transaction = await getPaymentTransactionsByUserId(userId);

        if (!transaction) {
            return res.status(404).json({ error: "No transactions found for this user" });
        }

        res.status(200).json(transaction);
    } catch (error) {
        console.error("Error fetching payment transactions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

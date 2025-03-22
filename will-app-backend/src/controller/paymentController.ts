import { IRazorPaymentDetails } from "models/paymentDetails";
import { Request, Response } from "express";
import Razorpay from "razorpay";
import { insertPaymentEvent, insertPaymentOrder, updateRazorIdToPaymentOrder } from "../services/paymentServices";
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
        const { userId, serviceIds, willRegistration }: { userId?: string, serviceIds?: string[], willRegistration: number } = req.body;

        if (userId === undefined) {
            return res.status(400).json("user id is rerquired");
        }

        if (!serviceIds || serviceIds.length === 0) {
            return res.status(400).json({ error: "At least one service ID is required" });
        }
        console.log("service" + serviceIds)
        
        let  totalAmount = await calculateTotalPrice(serviceIds);

        totalAmount += willRegistration;

        if (totalAmount <= 0) {
            return res.status(400).json({ error: "Total amount must be greater than zero" });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZOR_PAY_ID ?? "",
            key_secret: process.env.RAZOR_PAY_SECRET ?? ""
        })

        const payment_capture = 1

        // CREATE PAYMENT ORDER
        var paymentOrder = await insertPaymentOrder(userId, totalAmount)

        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: paymentOrder.orderid,
            payment_capture
        }

        const response = await razorpay.orders.create(options)

        await updateRazorIdToPaymentOrder(paymentOrder.orderid, response.id);

        res.status(201).json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
};
import { PrismaClient } from "@prisma/client";
import { UUID } from "crypto";

const prisma = new PrismaClient();

export const insertPaymentOrder = async (userId: string, amount: number) => {
    return await prisma.paymentorders.create({
        data: { userid: userId, amount: amount }
    });
};

export const insertPaymentEvent = async (event: string, eventPayload: string, razorOrderId: string) => {
    await prisma.razorpaymentevents.create({
        data: {
            event,
            eventpayload: eventPayload,
            razororderid: razorOrderId,
        }
    })
}

export const updateRazorIdToPaymentOrder = async (orderId: string, razorId: string) => {
    return await prisma.paymentorders.update({
        where: { orderid: orderId },
        data: {
            razororderid: razorId
        }
    });
};
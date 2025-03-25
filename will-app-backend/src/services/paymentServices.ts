import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { UUID } from "crypto";

const prisma = new PrismaClient();

export const insertPaymentOrder = async (userId: string, amount: number) => {
    if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid amount value");
    }
    
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

export const upsertPaymentTransaction = async (
    orderId: string,
    userId: string,
    selectedServices: any,
    totalPrice: number,
    selectedCategories: any
) => {
    return await prisma.payment_transactions.upsert({
        where: { orderid: orderId },
        update: {
            selectedservices: selectedServices, 
            updatedat: new Date(),
            totalprice: totalPrice,
            selectedcategories: selectedCategories
        },
        create: {
            orderid: orderId, 
            userid: userId, 
            selectedservices: selectedServices,
            totalprice: totalPrice,
            selectedcategories: selectedCategories
        }
    });
};

export const getPaymentTransactionsByUserId = async (userId: string) => {
    return await prisma.payment_transactions.findFirst({
        where: { userid: userId },
        orderBy: {
            createdat: "desc",
        },
        select: {
            id: true,
            orderid: true,
            userid: true,
            selectedservices: true,
            selectedcategories: true,
            createdat: true,
            updatedat: true,
            totalprice: true
        }
    });
};
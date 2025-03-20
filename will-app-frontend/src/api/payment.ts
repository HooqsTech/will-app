import { IPaymentOrderResponse } from "../models/payment";

export const createPaymentOrder = async (userId: string, amount: number): Promise<IPaymentOrderResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: userId,
            amount: amount
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to create payment order");
    }

    const paymentResponse: IPaymentOrderResponse = await response.json();
    return paymentResponse;
};
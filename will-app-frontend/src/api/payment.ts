import { IPaymentOrderResponse } from "../models/payment";

export const createPaymentOrder = async (userId: string, serviceIds: string[], willRegistration: number): Promise<IPaymentOrderResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: userId,
            serviceIds: serviceIds,
            willRegistration: willRegistration
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to create payment order");
    }

    const paymentResponse: IPaymentOrderResponse = await response.json();
    return paymentResponse;
};
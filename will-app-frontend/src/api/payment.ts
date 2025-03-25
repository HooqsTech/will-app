import { IPaymentOrderResponse } from "../models/payment";
import {IWillService, ICategory} from "../models/willService"

export const createPaymentOrder = async (userId: string, serviceIds: string[], categoryId : string): Promise<IPaymentOrderResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: userId,
            serviceIds: serviceIds,
            categoryId: categoryId
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to create payment order");
    }

    const paymentResponse: IPaymentOrderResponse = await response.json();
    return paymentResponse;
};

export const getPaymentTransactionsByPhoneNumber = async (userId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payments/transactions/${userId}`,
        {
          method: "GET",
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch payment transactions");
      }
  
      const transaction = await response.json();
  
      if (!transaction) {
        throw new Error("No transactions found for this user");
      }
  
      return {
        ...transaction,
        selectedServices: transaction.selectedServices
          ? JSON.parse(transaction.selectedServices) as IWillService[]
          : [],
          selectedCategories: transaction.selectedCategories && typeof transaction.selectedCategories === "object"
          ? transaction.selectedCategories as ICategory
          : null
      };
    } catch (error) {
      console.error("Error fetching payment transactions:", error);
      throw error;
    }
  };

  export const createOrUpdatePaymentTransaction = async (
    orderId: string,
    userId: string,
    selectedServices: IWillService[],
    selectedCategories: ICategory
) => {
    try {
      console.log("OrderId" + orderId)
      console.log("userId" + userId)
      console.log("selectedServices" + selectedServices)
      console.log("selectedCategories" + selectedCategories)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderId,
                userId,
                selectedServices,
                selectedCategories
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create/update payment transaction");
        }

        const data = await response.json();
        return data.transaction;
    } catch (error) {
        console.error("Error in createOrUpdatePaymentTransaction:", error);
        throw error;
    }
};
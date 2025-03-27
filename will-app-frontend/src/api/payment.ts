import { IPaymentOrderResponse } from "../models/payment";
import {IWillService, ICategory, ITransaction} from "../models/willService"

export const createPaymentOrder = async (
  userId: string, 
  serviceIds: string[], 
  categoryId: string, 
  isNewTransaction: boolean
): Promise<IPaymentOrderResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: userId,
            serviceIds: serviceIds,
            categoryId: categoryId,
            isNewTransaction: isNewTransaction
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
    selectedCategories: ICategory,
    isNewTransaction: boolean
) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderId,
                userId,
                selectedServices,
                selectedCategories,
            isNewTransaction: isNewTransaction
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


export const getPaymentTransactionsByPhoneNumbers = async (userId: string) => {
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

    const transactions: ITransaction[] = await response.json();

    if (!transactions || transactions.length === 0) {
      throw new Error("No transactions found for this user");
    }

    const normalizedTransactions = transactions.map(transaction => ({
      ...transaction,
      selectedCategories: transaction.selectedcategories
        ? (Array.isArray(transaction.selectedcategories)
          ? transaction.selectedcategories
          : [transaction.selectedcategories])
        : [], // ✅ Ensures it's an array & removes null
    }));

    return normalizedTransactions;
  } catch (error) {
    console.error("Error fetching payment transactions:", error);
    throw error;
  }
};

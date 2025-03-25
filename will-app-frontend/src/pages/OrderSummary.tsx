import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { TransactionSummaryState } from "../atoms/TransactionSummaryState";
import { getPaymentTransactionsByPhoneNumber } from "../api/payment";
import Header from "../components/Header";
import { userState } from "../atoms/UserDetailsState";
import { getUserIdByPhoneNumber } from "../api/user";
import { getCookie } from "typescript-cookie";
import { FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router";

const OrderSummary = () => {
  const navigate = useNavigate();
  const [payment, setPayment] = useRecoilState(TransactionSummaryState);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useRecoilState(userState);

  const handleDownload = () => {
    console.log("We need to handle this download part");
  };

  const handleFindPlan = () => {
    console.log("Redirect to Find Plan page");
    navigate("/my_plan")
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const phoneNumber = getCookie("phoneNumber");
        if (!phoneNumber) {
          console.error("Phone number not found in cookies.");
          return;
        }

        const userIdFromApi = await getUserIdByPhoneNumber(phoneNumber);
        if (userIdFromApi) {
          setUserId({ userId: userIdFromApi });
        } else {
          console.error("User ID not found.");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    if (!userId?.userId) {
      fetchUserId();
    }
  }, [userId, setUserId]);

  useEffect(() => {
    if (!userId?.userId) return;

    const fetchPaymentTransactions = async () => {
      try {
        const transaction = await getPaymentTransactionsByPhoneNumber(userId.userId);
        console.log("Raw transaction data:", transaction);

        const formattedTransaction = {
          ...transaction,
          selectedServices: transaction.selectedservices ?? [],
          selectedCategories: Array.isArray(transaction.selectedcategories)
            ? transaction.selectedcategories
            : transaction.selectedcategories
            ? [transaction.selectedcategories]
            : [],
        };

        console.log("Formatted Transaction Data:", formattedTransaction);
        console.log("Selected Categories:", formattedTransaction.selectedCategories);
        console.log("Selected Services:", formattedTransaction.selectedServices);

        setPayment(formattedTransaction);
      } catch (error) {
        console.error("Error fetching payment transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentTransactions();
  }, [userId, setPayment]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  const hasItems =
    (payment?.selectedCategories && payment.selectedCategories.length > 0) ||
    (payment?.selectedServices && payment.selectedServices.length > 0);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-full bg-[#265e55] z-50 shadow-md">
        <Header />
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg mt-20">
        {!hasItems ? (
          <div className="flex flex-col items-center text-center">
            <p className="text-lg font-semibold text-gray-700 mb-4">
              No active plans found.
            </p>
            <button
              onClick={handleFindPlan}
              className="bg-[#265e55] text-white px-6 py-3 rounded-lg hover:bg-[#1f4a43] transition"
            >
              Find Plan
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center bg-[#265e55] rounded-full mb-3 shadow-lg">
                <CheckCircleIcon className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-xl font-semibold">Summary!</h2>
              <span className="bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded mt-2">
                ORDER NO. {payment?.orderid || "N/A"}
              </span>
            </div>

            {/* Purchased Categories & Services in a Single Section */}
            <div className="mt-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Summary</h3>
              <div className="space-y-2">
                {/* Categories */}
                {(payment?.selectedCategories || []).map((category) => (
                  <div key={category.categoryId} className="flex justify-between items-center p-2 rounded-lg">
                    <p className="text-gray-800 font-medium text-sm">{category.categoryName}</p>
                    <p className="text-[#265e55] font-semibold text-sm">
                      ₹{category.categoryDiscountPrice ?? category.categoryStandardPrice}
                    </p>
                  </div>
                ))}

                {/* Services */}
                {(payment?.selectedServices || []).map((service) => (
                  <div key={service.serviceId} className="flex justify-between items-center p-2 rounded-lg">
                    <p className="text-gray-800 font-medium text-sm">{service.serviceName}</p>
                    <p className="text-[#265e55] font-semibold text-sm">
                      ₹{service.serviceDiscountPrice ?? service.serviceStandardPrice}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Price */}
            <div className="mt-5 border-t border-gray-300 pt-4">
            <div className="text-center text-lg font-semibold text-gray-800">
              Total: ₹{payment.totalprice}
            </div>
              
              <div className="flex justify-center mt-5">
                <button
                  onClick={handleDownload}
                  className="flex items-center bg-[#265e55] text-white px-4 py-2 rounded-lg hover:bg-[#1f4a43] transition"
                >
                  <FaDownload className="mr-2" /> Download Invoice
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
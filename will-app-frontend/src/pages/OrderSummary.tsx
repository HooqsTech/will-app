import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { TransactionSummaryState } from "../atoms/TransactionSummaryState";
import { getPaymentTransactionsByPhoneNumbers } from "../api/payment";
import Header from "../components/Header";
import { userState } from "../atoms/UserDetailsState";
import { getUserIdByPhoneNumber } from "../api/user";
import { getCookie } from "typescript-cookie";
import { FaDownload, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router";
import { ITransaction } from "../models/willService";
import { IFormattedServiceCategory } from "../models/willService";
import { getWillServices } from "../api/willService";
import Swal from "sweetalert2";
import { pathState } from "../atoms/serviceState";
import { downloadPdfFile, generatePdfFile } from "../api/pdf";
import { Button } from "@mui/material";
import { pageLoadingState } from "../atoms/PageLoadingState";

const OrderSummary = () => {
  const navigate = useNavigate();
  const [payment, setPayment] = useRecoilState(TransactionSummaryState);
  const setLoading = useSetRecoilState(pageLoadingState);
  const [userId, setUserId] = useRecoilState(userState);
  const [, setPath] = useRecoilState(pathState);
  const [_, setSelectedOrder] = useState<ITransaction | null>(null);
  const [serviceCounts, setServiceCounts] = useState<{ categoryId: string; categoryName: string; serviceCount: number }[]>([]);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsPdfGenerating(true);
    await generatePdfFile(userId.userId)
    setIsPdfGenerating(false);
  };

  const handleDownload = async () => {
    setIsPdfDownloading(true);
    await downloadPdfFile(userId.userId)
    setIsPdfDownloading(false);
  }

  const totalAmount =
    payment?.reduce((total, order) => total + (Number(order.totalprice) || 0), 0) ?? 0;

  const handleEdit = () => {
    const hasValidService = serviceCounts.some(item => item.serviceCount > 0);
    if (hasValidService) {
      setPath({ path: "findPlan" });
      navigate("/my_plan?step=2");
    } else {
      Swal.fire({
        title: "No Service Available!",
        text: "Please select a category before proceeding.",
        icon: "warning",
        confirmButtonColor: "var(--color-will-green)",
        customClass: {
          popup: "swal-sm",
          title: "swal-title",
          confirmButton: "swal-confirm-btn",
        },
      });
    }
  };

  const handleFindPlan = () => {
    setPath({ path: "findPlan" });
    navigate("/my_plan");
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

    const fetchAndProcessData = async () => {
      try {
        setLoading(true);

        // Fetch transactions
        const transactions = await getPaymentTransactionsByPhoneNumbers(userId.userId);
        const normalizedTransactions = transactions.map(transaction => ({
          ...transaction,
          selectedCategories: transaction.selectedCategories
            ? (Array.isArray(transaction.selectedCategories)
              ? transaction.selectedCategories
              : [transaction.selectedCategories])
            : [],
          selectedServices: transaction.selectedservices
            ? (Array.isArray(transaction.selectedservices)
              ? transaction.selectedservices
              : [transaction.selectedservices])
            : [],
        }));

        const willServices: IFormattedServiceCategory[] = await getWillServices();

        const selectedCategoryIds = transactions.flatMap(t => {
          // Ensure selectedcategories is always treated as an array
          const categories = t.selectedcategories
            ? (Array.isArray(t.selectedcategories) ? t.selectedcategories : [t.selectedcategories])
            : [];

          return categories.map(c => c.categoryId);
        });

        const selectedServiceIds = transactions.flatMap(t =>
          (t.selectedservices ? (Array.isArray(t.selectedservices) ? t.selectedservices : [t.selectedservices]) : []).map(s => s.serviceId)
        );

        const formattedData: IFormattedServiceCategory[] = willServices
          .filter(category => selectedCategoryIds.includes(category.categoryId))
          .map(category => ({
            ...category,
            services: category.services.filter(service => !selectedServiceIds.includes(service.serviceId))
          }));

        const serviceCounts = formattedData.map(category => ({
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          serviceCount: category.services.length
        }));

        setServiceCounts(serviceCounts);
        setPayment(normalizedTransactions);

        if (normalizedTransactions.length > 0) {
          setSelectedOrder(normalizedTransactions[0]);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, [userId, setPayment]);

  const hasItems = payment?.some(
    (transaction) =>
      (transaction.selectedcategories && transaction.selectedcategories) ||
      (transaction.selectedservices && transaction.selectedservices.length > 0)
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-full bg-[#265e55] z-50 shadow-md">
        <Header />
      </div>

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl mt-40">
        {!hasItems ? (
          <div className="flex flex-col items-center justify-center text-center min-h-96">
            <p className="text-lg font-semibold text-gray-700 mb-4">
              No active plans found.
            </p>
            <button
              onClick={handleFindPlan}
              className="bg-[#265e55] text-white px-6 py-3 rounded-md hover:bg-[#1f4a43] transition"
            >
              Find Plan
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Summary!</h2>

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-700">
                All Orders Service Summary
              </h3>
            </div>

            <div className="border-t border-b divide-y divide-gray-200">
              {payment?.flatMap((order) => {
                const categories = Array.isArray(order.selectedcategories)
                  ? order.selectedcategories
                  : order.selectedcategories
                    ? [order.selectedcategories]
                    : [];

                const services = order.selectedservices || [];

                return [
                  ...categories.map((category) => (
                    <div
                      key={`cat-${order.orderid}-${category.categoryId}`}
                      className="flex justify-between items-center py-4"
                    >
                      <span className="text-gray-700 font-medium text-base">
                        {category.categoryName}
                      </span>
                      <span className="text-[#265e55] font-semibold text-base">
                        ₹{category.categoryDiscountPrice ?? category.categoryStandardPrice}
                      </span>
                    </div>
                  )),
                  ...services.map((service) => (
                    <div
                      key={`serv-${order.orderid}-${service.serviceId}`}
                      className="flex justify-between items-center py-4"
                    >
                      <span className="text-gray-700 font-medium text-base">
                        {service.serviceName}
                      </span>
                      <span className="text-[#265e55] font-semibold text-base">
                        ₹{service.serviceDiscountPrice ?? service.serviceStandardPrice}
                      </span>
                    </div>
                  )),
                ];
              })}
            </div>

            <div className="flex justify-end items-center mt-6">
              <span className="text-lg font-semibold text-gray-800">
                Total: ₹{totalAmount}
              </span>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={handleGenerate}
                loading={isPdfGenerating}
                className="flex items-center justify-center gap-2 !bg-[#265e55] !text-white px-6 py-3 rounded-md hover:bg-[#1f4a43]"
              >
                <FaDownload /> Generate
              </Button>

              <Button
                onClick={handleDownload}
                loading={isPdfDownloading}
                className="flex items-center justify-center gap-2 !bg-[#265e55] !text-white px-6 py-3 rounded-md hover:bg-[#1f4a43]"
              >
                <FaDownload /> Download
              </Button>

              <Button
                onClick={handleEdit}
                className="flex items-center justify-center gap-2 !bg-[#265e55] !text-white px-6 py-3 rounded-md hover:bg-[#1f4a43]"
              >
                <FaEdit /> Edit
              </Button>
            </div>
          </>
        )}
      </div>
    </div>

  );
};

export default OrderSummary;

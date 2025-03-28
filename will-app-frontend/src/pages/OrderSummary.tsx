import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
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

const OrderSummary = () => {
  const navigate = useNavigate();
  const [payment, setPayment] = useRecoilState(TransactionSummaryState);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useRecoilState(userState);
  const [, setPath] = useRecoilState(pathState);
  const [selectedOrder, setSelectedOrder] = useState<ITransaction | null>(null);
  const [serviceCounts, setServiceCounts] = useState<{ categoryId: string; categoryName: string; serviceCount: number }[]>([]);

  const handleDownload = () => {
    console.log("We need to handle this download part");
  };

  const handleEdit = () => {
    console.log(serviceCounts)
    const hasValidService = serviceCounts.some(item => item.serviceCount > 0);

    console.log(hasValidService)

    if (hasValidService) {
      console.log("Redirecting to My Plan - Step 2");
      setPath({path:"findPlan"});
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
    console.log("Redirecting to Find Plan");
    setPath({path:"findPlan"});
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
        
        console.log("Normal"  +JSON.stringify(normalizedTransactions, null, 2) )
        //console.log("will"+JSON.stringify(willServices, null, 2) )
        console.log("Selected Category"+ selectedCategoryIds)
        console.log("Selected Servie"+ selectedServiceIds)
        
        const formattedData: IFormattedServiceCategory[] = willServices
          .filter(category => selectedCategoryIds.includes(category.categoryId))
          .map(category => ({
            ...category,
            services: category.services.filter(service => !selectedServiceIds.includes(service.serviceId))
          }));
  
        console.log("Processed Data:",JSON.stringify(formattedData, null, 2) );
        
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  const hasItems = payment?.some(
    (transaction) =>
      (transaction.selectedcategories && transaction.selectedcategories.length > 0) ||
      (transaction.selectedservices && transaction.selectedservices.length > 0)
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
  <div className="fixed top-0 left-0 w-full bg-[#265e55] z-50 shadow-md">
    <Header />
  </div>

  <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg mt-40">
    {!hasItems ? (
      <div className="flex flex-col items-center justify-center text-center min-h-96">
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
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-5">Summary!</h2>
        <div className="flex items-center mb-4 justify-center">
          <label className="text-gray-700 font-semibold pr-2">Select Order:</label>
          <select
            className="border px-2 py-1 rounded mr-2"
            value={selectedOrder?.orderid || ""}
            onChange={(e) => {
              const order = payment?.find((p) => p.orderid === e.target.value);
              setSelectedOrder(order || null);
            }}
          >
            {payment?.map((order) => (
              <option key={order.orderid} value={order.orderid}>
                {order.orderid}
              </option>
            ))}
          </select>
        </div>

        {selectedOrder ? (
          <>
            <div className="text-center">
              <span className="bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded mt-2">
                ORDER NO. {selectedOrder.orderid}
              </span>
            </div>

            <div className="mt-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Summary</h3>
              <div className="space-y-2">
                {selectedOrder?.selectedcategories &&
                  (Array.isArray(selectedOrder.selectedcategories)
                    ? selectedOrder.selectedcategories.length > 0
                    : true) &&
                  (Array.isArray(selectedOrder.selectedcategories)
                    ? selectedOrder.selectedcategories
                    : [selectedOrder.selectedcategories]
                  ).map((category) => (
                    <div key={category.categoryId} className="flex justify-between p-2">
                      <p className="text-gray-800 font-medium text-sm">{category.categoryName}</p>
                      <p className="text-[#265e55] font-semibold text-sm">
                        ₹{category.categoryDiscountPrice ?? category.categoryStandardPrice}
                      </p>
                    </div>
                  ))}

                {selectedOrder?.selectedservices?.length > 0 &&
                  selectedOrder.selectedservices.map((service) => (
                    <div key={service.serviceId} className="flex justify-between p-2">
                      <p className="text-gray-800 font-medium text-sm">{service.serviceName}</p>
                      <p className="text-[#265e55] font-semibold text-sm">
                        ₹{service.serviceDiscountPrice ?? service.serviceStandardPrice}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-5 border-t pt-4 text-center">
              <div className="text-lg font-semibold text-gray-800">Total: ₹{selectedOrder.totalprice}</div>
              <div className="flex justify-center mt-5 gap-10">
                <button onClick={handleDownload} className="flex items-center bg-[#265e55] text-white px-4 py-2 rounded-lg">
                  <FaDownload className="mr-2" /> Generate Will
                </button>
                <button onClick={handleEdit} className="flex items-center bg-[#265e55] text-white px-4 py-2 rounded-lg">
                  <FaEdit className="mr-2" /> Buy Additional Service
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">No orders found.</p>
        )}
      </>
    )}
  </div>
</div>

  );
};

export default OrderSummary;

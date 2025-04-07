import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { formattedCategoriesState, pathState, selectedCategoryState, selectedServicesState, } from "../atoms/serviceState";
import { ICategory, IFormattedServiceCategory, IWillService } from "../models/willService";
import { getWillServices } from "../api/willService";
import Header from "../components/Header";
import PaymentStepper from "../components/PaymentStepper";
import { motion } from "framer-motion";
import { FaCheck, FaPlus, FaTrash, FaInfoCircle } from "react-icons/fa";
import { createPaymentOrder, createOrUpdatePaymentTransaction } from "../api/payment";
import Swal from "sweetalert2";
import { getUserIdByPhoneNumber } from "../api/user";
import { getCookie } from "typescript-cookie";
import { TransactionSummaryState } from "../atoms/TransactionSummaryState";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { pageLoadingState } from "../atoms/PageLoadingState";
import { Button } from "@mui/material";

const MyPlan: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useRecoilState(formattedCategoriesState);
  const [selectedCategory, setSelectedCategory] = useRecoilState(selectedCategoryState);
  const setLoading = useSetRecoilState(pageLoadingState);
  const [params] = useSearchParams();
  const initialStep = Number(params.get("step")) || 1;
  //const initialStep =  1; 
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useRecoilState(
    selectedServicesState
  );
  const [step, setStep] = useState<number>(initialStep);
  // const [coupon, setCoupon] = useState("");
  const [infoIndex, setInfoIndex] = useState<string | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const transactionState = useRecoilValue(TransactionSummaryState);
  const pathStateValue = useRecoilValue(pathState);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //       navigate(`/my_plan?step=${step}`, { replace: true });
  // }, [step, navigate]);
  useEffect(() => {
    if (pathStateValue.path == "") {
      navigate(`/order_summary`);
    }

  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data: IFormattedServiceCategory[] = await getWillServices();

        let formattedData: IFormattedServiceCategory[];

        if (!transactionState || transactionState.length === 0) {
          formattedData = data.map((service) => ({
            categoryId: service.categoryId,
            categoryName: service.categoryName,
            categoryStandardPrice: service.categoryStandardPrice ?? 0,
            categoryDiscountPrice: service.categoryDiscountPrice ?? null,
            categoryDescription: service.categoryDescription ?? null,
            services: service.services || [],
          }));
        } else {
          setSelectedServices([]);

          const selectedCategoryIds: string[] = transactionState.flatMap((t) => {
            const selectedCategories = t.selectedcategories as
              | { categoryId: string }[]
              | { categoryId: string }
              | null
              | undefined;

            if (Array.isArray(selectedCategories)) {
              return selectedCategories.map((c) => c.categoryId);
            } else if (selectedCategories && typeof selectedCategories === "object") {
              return [selectedCategories.categoryId];
            }
            return [];
          });

          const selectedServiceIds = //new Set(
            transactionState.flatMap((t) =>
              Array.isArray(t.selectedservices) ? t.selectedservices.map((s) => s.serviceId) : []
            );
          //);

          formattedData = data
            .filter((category) => selectedCategoryIds.includes(category.categoryId))
            .map((category) => ({
              ...category,
              services: category.services.filter(
                (s) => !selectedServiceIds.includes(s.serviceId)
              ),
            }));

          if (formattedData.length > 0) {
            setSelected(formattedData[0].categoryId);
            setSelectedCategory(formattedData[0]);
          }
        }

        setCategories(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [setCategories, transactionState]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setInfoIndex(null);
      }
    };

    if (infoIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [infoIndex]);

  const handleSelectCategory = (category: ICategory) => {
    setSelected(category.categoryId);
    setSelectedCategory(category);
  };

  const handleSelectService = (service: IWillService) => {
    setSelectedServices((prev) => {
      const isAlreadySelected = prev.some((s) => s.serviceId === service.serviceId);

      if (isAlreadySelected) {
        return prev.filter((s) => s.serviceId !== service.serviceId);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.filter((s) => s.serviceId !== serviceId)
    );
  };

  function loadScript(src: string) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const handleContinue = async () => {
    if (step === 1) {
      if (!selectedCategory) {
        Swal.fire({
          title: "No Category Selected!",
          text: "Please select a category before proceeding.",
          icon: "warning",
          confirmButtonColor: "var(--color-will-green)",
          customClass: {
            popup: "swal-sm",
            title: "swal-title",
            confirmButton: "swal-confirm-btn",
          },
        });
        return;
      }

      if (selectedCategory?.categoryName === "NRI Will") {
        setStep(3);
      } else if (selected) {
        setStep(2);
      }
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (selectedServices.length === 0 && total === 0) {
        Swal.fire({
          title: "Neither Service nor Category has been Selected!",
          text: "Please select at least one service before proceeding.",
          icon: "warning",
          confirmButtonColor: "var(--color-will-green)",
          customClass: {
            popup: "swal-sm",
            title: "swal-title",
            confirmButton: "swal-confirm-btn",
          },
        });
        return;
      }
      // REDIRECT TO PAYMENT
      await payNow();
    }
  };

  const payNow = async () => {
    setIsLoading(true);
    let res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      return
    }

    const phoneNumber = getCookie("phoneNumber");
    const user = await getUserIdByPhoneNumber(phoneNumber ?? "");

    // CREATE PAYMENT ORDER
    const selectedServiceIds = selectedServices.map((service) => service.serviceId);

    var data = await createPaymentOrder(
      user,
      selectedServiceIds,
      selectedCategory?.categoryId ?? "",
      transactionState === null
    );

    const options = {
      key: import.meta.env.VITE_RAZOR_PAY_ID,
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      name: 'Payment',
      description: 'Thank you for choosing Hamaara will.',
      image: "",
      handler: async function (_: any) {
        if (!selectedCategory) {
          return;
        }
        const categoryData = {
          categoryId: selectedCategory.categoryId,
          categoryName: selectedCategory.categoryName,
          categoryDescription: selectedCategory.categoryDescription,
          categoryStandardPrice: selectedCategory.categoryStandardPrice,
          categoryDiscountPrice: selectedCategory.categoryDiscountPrice,
        };

        await createOrUpdatePaymentTransaction(data.id, user, selectedServices, categoryData, transactionState === null);
        Swal.fire({
          title: "Your payment is successfull.",
          confirmButtonText: "Okay",
          confirmButtonColor: "var(--color-will-green)",
        });
        navigate("/order_summary");
      },
      modal: {
        ondismiss: function () {
          Swal.fire({
            title: "Payment cancelled.",
            confirmButtonText: "Okay",
            confirmButtonColor: "var(--color-will-green)",
          });
        }
      }
    }

    setIsLoading(false);
    const _window = window as any
    const paymentObject = _window.Razorpay(options)
    paymentObject.open()
  }

  const handlePrevious = () => {
    if (step === 3) {
      if (selectedCategory?.categoryName === "NRI Will") {
        setStep(1);
      } else {
        setStep(2);
      }
    } else if (step === 2) {
      if (transactionState) {
        navigate("/order_summary");
      } else {
        setStep(1);
      }
    } else {
      navigate(-1);
    }
  };
  const selectedCategoryData = categories.find(
    (cat) => cat.categoryId === selectedCategory?.categoryId
  );
  const services = selectedCategoryData?.services ?? [];
  const total =
    (transactionState === null && selectedCategory
      ? selectedCategory.categoryDiscountPrice ?? selectedCategory.categoryStandardPrice
      : 0) +
    selectedServices.reduce(
      (sum, service) => sum + (service.serviceDiscountPrice ?? service.serviceStandardPrice),
      0
    );

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-white text-white p-6">
      <div className="fixed top-0 left-0 w-full bg-[#265e55] z-50">
        <Header />
      </div>

      <div className="mt-24">
        <PaymentStepper currentStep={step} />
      </div>

      {step === 1 && (
        <div className="flex flex-col items-center w-full text-center mt-8">
          <h2 className="text-xl font-semibold text-[#265e55]">Choose a Category</h2>
          <p className="text-[#265e55] mt-2 max-w-md">
            Select a category to explore its services.
          </p>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-10 relative">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.categoryId} className="relative w-full">
                  {/* Info Panel (Appears Above the Info Button) */}
                  {infoIndex === category.categoryId && (
                    <motion.div
                      ref={infoRef}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-0 mb-3 -right-[100px] md:-right-[380px] transform -translate-x-1/2 w-64 bg-white rounded-none p-4 border border-gray-600 z-40">
                      <h4 className="text-md font-semibold text-[#265e55]">
                        {category.categoryName}
                      </h4>
                      <ul className="text-sm text-gray-400 list-disc pl-6 mt-2">
                        {category.categoryDescription
                          .split('.')
                          .filter((point) => point.trim() !== '')
                          .map((point, index) => (
                            <li key={index}>{point.trim()}</li>
                          ))}
                      </ul>
                      <button
                        className="mt-3 text-[#265e55] text-sm hover:text-blue-300"
                        onClick={() => setInfoIndex(null)}
                      >
                        Close
                      </button>
                    </motion.div>
                  )}

                  {/* Category Card */}
                  <motion.div
                    className={`relative p-6 rounded-none transition-all duration-300 border cursor-pointer ${selected === category.categoryId
                      ? "border-green-500 bg-[#265e55] scale-105"
                      : "border-gray-600 bg-[#265e55] hover:shadow-lg hover:scale-105"
                      }`}
                    onClick={() => handleSelectCategory(category)}
                    whileHover={{ transition: { duration: 0.2 } }}
                  >
                    {selected === category.categoryId && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
                        <FaCheck size={14} />
                      </div>
                    )}

                    <h3 className="text-xl font-semibold">
                      {category.categoryName}
                    </h3>
                    {category.categoryDiscountPrice && (
                      <p className="text-gray-400 line-through">
                        ₹{category.categoryStandardPrice}
                      </p>
                    )}
                    <p className="text-2xl font-bold text-green-400">
                      ₹
                      {category.categoryDiscountPrice ||
                        category.categoryStandardPrice}
                    </p>
                    <p className="text-gray-400 text-sm">One-time cost</p>

                    {/* Info Button (Triggers Panel) */}
                    <button
                      className="absolute bottom-3 right-3 text-gray-400 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInfoIndex(
                          infoIndex === category.categoryId
                            ? null
                            : category.categoryId
                        );
                      }}
                    >
                      <FaInfoCircle size={18} />
                    </button>

                  </motion.div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">Loading plans...</p>
            )}
          </div>
          <div className="left-0 w-full bg-dark pt-10 flex justify-between max-w-2xl mx-auto translate-x-70">
            <button
              onClick={handleContinue}
              className="flex items-center cursor-pointer bg-[#265e55] text-white px-4 py-2 rounded-none hover:bg-[#1e4a42] transition"
            >
              <FaArrowRight className="mr-2" /> Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Premium Services */}
      {step === 2 && (
        <div className="relative flex flex-col items-center min-h-screen bg-white text-white p-6">
          {/* Title & Description */}
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold text-[#265e55]">
              Would you like to opt for any premium services?
            </h2>
            <p className="text-[#265e55] mt-2 max-w-md ">
              Choose from our selection of premium add-ons that offer convenient
              and quick options to further simplify this process for you.
            </p>
          </div>

          {/* Services List */}
          <div
            className={`grid md:grid-cols-3 gap-6 w-full max-w-4xl mt-8 ${services.length === 1 ? "justify-center" : ""
              }`}
          >
            {services.length > 0 ? (
              services.map((service) => (
                <motion.div
                  key={service.serviceId}
                  className={`relative p-6 rounded-none transition-all duration-300 border cursor-pointer ${selectedServices.some(
                    (s) => s.serviceId === service.serviceId
                  )
                    ? "border-green-400 bg-[#265e55] scale-105"
                    : "border-gray-600 bg-[#265e55] hover:shadow-lg hover:scale-105"
                    }`}
                  onClick={() => handleSelectService(service)}
                  whileHover={{ transition: { duration: 0.2 } }}
                >
                  {selectedServices.some(
                    (s) => s.serviceId === service.serviceId
                  ) && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
                        <FaCheck size={14} />
                      </div>
                    )}

                  <h3 className="text-lg font-semibold">
                    {service.serviceName}
                  </h3>
                  <p className="text-2xl font-bold text-green-400">
                    ₹{service.serviceDiscountPrice?.toLocaleString() ? service.serviceDiscountPrice?.toLocaleString() : service.serviceStandardPrice.toLocaleString()}.00
                  </p>
                  <p className="text-gray-400 text-sm">One-time cost</p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-center text-sm">
                No premium services available for this category.
              </p>
            )}
          </div>

          {/* Coupon Code Input */}
          {/* <div className="mt-6 w-full max-w-md flex">
            <input
              type="text"
              placeholder="Enter coupon code or referral code"
              className="flex-1 px-4 py-2 border border-gray-600 rounded-l-lg focus:outline-none bg-white text-gray-800"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button className="bg-[#265e55] text-white px-4 py-2 rounded-r-lg">
              Apply
            </button>
          </div> */}

          <div className="left-0 w-full bg-dark pt-10 flex justify-between max-w-2xl mx-auto">
            <button
              onClick={handlePrevious}
              className="flex items-center cursor-pointer bg-[#265e55] text-white px-4 py-2 rounded-none hover:bg-[#1e4a42] transition"
            >
              <FaArrowLeft className="mr-2" /> Previous
            </button>

            <button
              onClick={handleContinue}
              className="flex items-center cursor-pointer bg-[#265e55] text-white px-4 py-2 rounded-none hover:bg-[#1e4a42] transition"
            >
              <FaArrowRight className="mr-2" /> Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="relative flex flex-col items-center min-h-screen bg-white text-white p-6">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#265e55]">
              Choose Your Premium Services
            </h2>
          </div>

          {/* Service List Container */}
          <div className="lg:w-[800px] md:w-[600px] mt-8 mx-10 bg-[#265e55] p-6 rounded-none shadow-lg">
            {transactionState === null && (
              <div className="flex justify-between items-center py-3 border-b border-gray-600 font-bold text-lg">
                <span>{selectedCategory?.categoryName}</span>
                <span className="text-green-400">
                  ₹{selectedCategory?.categoryDiscountPrice?.toLocaleString() ? selectedCategory?.categoryDiscountPrice.toLocaleString() : selectedCategory?.categoryStandardPrice.toLocaleString()}.00
                </span>
              </div>
            )}

            {/* Other Services */}
            {services.map((service) => {
              const isSelected = selectedServices.some(
                (s) => s.serviceId === service.serviceId
              );

              return (
                <div
                  key={service.serviceId}
                  className="flex justify-between items-center py-3 border-b border-gray-700"
                >
                  <span className="flex-1">{service.serviceName}</span>

                  {isSelected ? (
                    <>
                      <span className="text-green-400 font-semibold">
                        ₹{service.serviceDiscountPrice?.toLocaleString() ? service.serviceDiscountPrice?.toLocaleString() : service.serviceStandardPrice.toLocaleString()}.00
                      </span>
                      <button
                        onClick={() => handleRemoveService(service.serviceId)}
                        className="ml-4 bg-red-600 cursor-pointer text-white px-3 py-1 rounded-full shadow-md hover:bg-red-700 transition"
                      >
                        <FaTrash />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleSelectService(service)}
                      className="ml-4 bg-green-600 cursor-pointer text-white px-3 py-1 rounded-full shadow-md hover:bg-green-700 transition"
                    >
                      <FaPlus />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Total Section */}
            <div className="flex justify-between mt-6 font-bold text-xl border-t border-gray-600 pt-4">
              <span>Total</span>
              <span className="text-green-400">
                ₹{total.toLocaleString()}.00
              </span>
            </div>
          </div>

          <div className="left-0 w-full bg-dark pt-10 flex justify-between max-w-2xl mx-auto">
            <button
              onClick={handlePrevious}
              className="flex items-center cursor-pointer bg-[#265e55] text-white px-4 py-2 rounded-none hover:bg-[#1e4a42] transition"
            >
              <FaArrowLeft className="mr-2" /> Previous
            </button>

            <Button
              onClick={handleContinue}
              loading={isLoading}
              sx={{
                borderRadius: 0
              }}
              className="flex items-center cursor-pointer !bg-[#265e55] !text-white !px-4 !py-2 rounded-none hover:bg-[#1e4a42] transition"
            >
              <FaArrowRight className="mr-2" /> Pay Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPlan;
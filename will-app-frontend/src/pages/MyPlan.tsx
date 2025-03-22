import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  FaCheck,
  FaInfoCircle,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Swal from "sweetalert2";
import { getCookie } from "typescript-cookie";
import { createPaymentOrder } from "../api/payment";
import { getUserIdByPhoneNumber } from "../api/user";
import { getWillServices } from "../api/willService";
import { formattedCategoriesState, selectedCategoryState, selectedServicesState, } from "../atoms/serviceState";
import BackButton from "../components/BackButton";
import Header from "../components/Header";
import NextButton from "../components/NextButton";
import PaymentStepper from "../components/PaymentStepper";
import { IFormattedServiceCategory, IWillService } from "../models/willService";

const WILL_WITH_REGISTRATION_PRICE = parseInt(
  import.meta.env.VITE_WILL_WITH_REGISTRATION_PRICE || "19999",
  10
);

const MyPlan: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialStep = Number(queryParams.get("step")) || 1;

  const [categories, setCategories] = useRecoilState(formattedCategoriesState);
  const setSelectedCategory = useSetRecoilState(selectedCategoryState);
  const [selected, setSelected] = useState<string | null>(null);
  const selectedCategory = useRecoilValue(selectedCategoryState);
  const [selectedServices, setSelectedServices] = useRecoilState(
    selectedServicesState
  );
  const [step, setStep] = useState(initialStep);
  const [coupon, setCoupon] = useState("");
  const [visibleServices, setVisibleServices] = useState<string[]>([]);
  const [infoIndex, setInfoIndex] = useState<string | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data: IFormattedServiceCategory[] = await getWillServices();
        const formattedData: IFormattedServiceCategory[] = data.map(
          (service) => ({
            categoryId: service.categoryId,
            categoryName: service.categoryName,
            categoryStandardPrice: service.categoryStandardPrice ?? 0,
            categoryDiscountPrice: service.categoryDiscountPrice ?? null,
            categoryDescription:
              service.categoryDescription ?? "service.categoryName",
            services: service.services || [],
          })
        );
        setCategories(formattedData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
    console.log(fetchCategories);
  }, [setCategories]);

  useEffect(() => {
    navigate(`/my_plan?step=${step}`, { replace: true });
  }, [step, navigate]);

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

  const handleSelectCategory = (categoryId: string) => {
    setSelected(categoryId);
    setSelectedCategory(categoryId);
  };

  const handleSelectService = (service: IWillService) => {
    setSelectedServices(
      (prev) =>
        prev.some((s) => s.serviceId === service.serviceId)
          ? prev.filter((s) => s.serviceId !== service.serviceId) // Remove if already selected
          : [...prev, service] // Add if not selected
    );
    setVisibleServices((prev) => [...prev, service.serviceId]);
  };
  const handleRemoveService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.filter((s) => s.serviceId !== serviceId)
    );
    setVisibleServices((prev) => prev.filter((id) => id !== serviceId));
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
    if (step === 1 && selected) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      //REDIRECT TO PAYMENTT..
      await payNow();
      navigate("/payment-summary");
    }
  };

  const payNow = async () => {
    let res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      return
    }

    const phoneNumber = getCookie("phoneNumber");
    const user = await getUserIdByPhoneNumber(phoneNumber ?? "");

    // CREATE PAYMENT ORDER
    var data = await createPaymentOrder(user, total)

    const options = {
      key: import.meta.env.VITE_RAZOR_PAY_ID,
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      name: 'Payment',
      description: 'Thank you for choosing Hamaara will.',
      image: "",
      handler: async function (_: any) {
        Swal.fire("Your payment is successfull.")
      }
    }
    const _window = window as any
    const paymentObject = _window.Razorpay(options)
    paymentObject.open()
  }

  const handlePrevious = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  const selectedCategoryData = categories.find(
    (cat) => cat.categoryId === String(selectedCategory)
  );
  const services = selectedCategoryData?.services ?? [];
  const commonService = {
    serviceName: "Will with Registration",
    serviceStandardPrice: WILL_WITH_REGISTRATION_PRICE,
  };

  const total =
    commonService.serviceStandardPrice +
    selectedServices.reduce(
      (sum, service) => sum + (service.serviceStandardPrice || 0),
      0
    );

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-white text-white p-6">
      <div className="mt-24">
        <PaymentStepper currentStep={step} />
      </div>

      <div className="fixed top-0 left-0 w-full bg-[#265e55] z-50">
        <Header />
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
                      className="absolute bottom-0 mb-3 -right-[100px] md:-right-[380px] transform -translate-x-1/2 w-64 bg-white rounded-lg p-4 border border-gray-600 z-40">
                      <h4 className="text-md font-semibold text-[#265e55]">
                        {category.categoryName}
                      </h4>
                      <ul className="text-sm text-gray-400 list-disc pl-4 mt-2">
                        {category.services.map((service, i) => (
                          <li key={i}>{service.serviceName}</li>
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
                    className={`relative p-6 rounded-xl transition-all duration-300 border cursor-pointer ${selected === category.categoryId
                      ? "border-green-500 bg-[#265e55] scale-105"
                      : "border-gray-600 bg-[#265e55] hover:shadow-lg hover:scale-105"
                      }`}
                    onClick={() => handleSelectCategory(category.categoryId)}
                    whileHover={{ scale: 1.05 }}
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
            <NextButton onClick={handleContinue} label="Continue" />
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
            className={`grid grid-cols-3 gap-6 w-full max-w-4xl mt-8 ${services.length === 1 ? "justify-center" : ""
              }`}
          >
            {services.length > 0 ? (
              services.map((service) => (
                <motion.div
                  key={service.serviceId}
                  className={`relative p-6 rounded-xl transition-all duration-300 border cursor-pointer ${selectedServices.some(
                    (s) => s.serviceId === service.serviceId
                  )
                    ? "border-green-400 bg-[#265e55] scale-105"
                    : "border-gray-600 bg-[#265e55] hover:shadow-lg hover:scale-105"
                    }`}
                  onClick={() => handleSelectService(service)}
                  whileHover={{ scale: 1.05 }}
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
                    ₹{service.serviceStandardPrice.toLocaleString()}.00
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
          <div className="mt-6 w-full max-w-md flex">
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
          </div>

          <div className="left-0 w-full bg-dark pt-10 flex justify-between max-w-2xl mx-auto">
            <BackButton onClick={handlePrevious} label="Previous" />
            <NextButton onClick={handleContinue} />
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
          <div className="w-[800px] mt-8 bg-[#265e55] p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center py-3 border-b border-gray-600 font-bold text-lg">
              <span>{commonService.serviceName}</span>
              <span className="text-green-400">
                ₹{commonService.serviceStandardPrice.toLocaleString()}.00
              </span>
            </div>

            {/* Other Services */}
            {services.map((service) => {
              const isSelected = selectedServices.some(
                (s) => s.serviceId === service.serviceId
              );
              const isVisible = visibleServices.includes(service.serviceId);

              return (
                <div
                  key={service.serviceId}
                  className="flex justify-between items-center py-3 border-b border-gray-700"
                >
                  <span className="flex-1">{service.serviceName}</span>

                  {/* Show price only if service is selected or made visible */}
                  {isSelected || isVisible ? (
                    <>
                      <span className="text-green-400 font-semibold">
                        ₹{service.serviceStandardPrice.toLocaleString()}.00
                      </span>
                      <button
                        onClick={() => handleRemoveService(service.serviceId)}
                        className="ml-4 bg-red-600 text-white px-3 py-1 rounded-full shadow-md hover:bg-red-700 transition"
                      >
                        <FaTrash />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleSelectService(service)}
                      className="ml-4 bg-green-600 text-white px-3 py-1 rounded-full shadow-md hover:bg-green-700 transition"
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
            <BackButton onClick={handlePrevious} label="Previous" />
            <NextButton onClick={handleContinue} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPlan;
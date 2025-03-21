import React from "react";
import CheckIcon from "@mui/icons-material/Check";

interface PaymentStepperProps {
  currentStep: number;
}

const steps = [1, 2, 3];

const PaymentStepper: React.FC<PaymentStepperProps> = ({ currentStep }) => {
  return (
    <div className="flex flex-col items-center mb-6">
      {/* Stepper */}
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            {/* Step Circle */}
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                step < currentStep
                  ? "bg-white text-[#265e55] border-[#265e55]"
                  : step === currentStep
                  ? "bg-[#265e55] text-white border-[#265e55]"
                  : "bg-white text-gray-400 border-gray-400"
              }`}
            >
              {step < currentStep ? (
                <CheckIcon fontSize="small" className="text-[#265e55]" />
              ) : (
                step
              )}
            </div>
            {/* Step Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 ${
                  step < currentStep ? "bg-[#265e55]" : "bg-gray-400"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PaymentStepper;

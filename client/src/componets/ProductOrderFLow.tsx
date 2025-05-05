"use client";
import React from "react";
import ProgressBar from "./form/ProgressBar";
import FormActions from "./FormActions";
import { useProductOrderFlow } from "@/contexts/prodouctOrderFlowContext";
import PriceCalculationResult from "./PriceCalculationResult";

const ProductOrderFlow = () => {
  const { options, currentStep } = useProductOrderFlow();

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Progress Steps */}
      <ProgressBar options={options} currentStep={currentStep} />

      <div className="min-h-[65vh]">
        {/* Form body*/}
        {options.map(
          (option) =>
            option.step === currentStep && option.render?.(option.step)
        )}
      </div>
      {currentStep == 2 && <PriceCalculationResult />}

      {/* Next Button */}
      <FormActions />
    </div>
  );
};

export default ProductOrderFlow;

"use client";
import React from "react";
import ProgressBar from "./form/ProgressBar";
import FormActions from "./FormActions";
import { useProductOrderFlow } from "@/contexts/prodouctOrderFlowContext";

const ProductOrderFlow = () => {
  const { options, currentStep } = useProductOrderFlow();

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Progress Steps */}
      <ProgressBar options={options} currentStep={currentStep} />

      {/* Form body*/}
      {options.map(
        (option) => option.step === currentStep && option.render?.(option.step)
      )}
      {/* Next Button */}
      <FormActions />
    </div>
  );
};

export default ProductOrderFlow;

"use client";
import React from "react";
import ProgressBar from "./form/ProgressBar";
import FormActions from "./FormActions";
import { useProductOrderFlow } from "@/hooks/useProductOrderFlow";

const ProductOrderFlow = () => {
  const { formBodies, currentStep, isLoading } = useProductOrderFlow();

  return (
    <form className="max-w-4xl mx-auto p-4">
      {/* Progress Steps */}
      <ProgressBar options={formBodies} currentStep={currentStep} />
      <div className="min-h-[40vh]">
        {/* Form body*/}
        {formBodies.map(
          (option) =>
            option.step === currentStep && option.render?.(option.step)
        )}
      </div>

      {!isLoading && <FormActions />}
    </form>
  );
};

export default ProductOrderFlow;

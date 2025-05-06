"use client";
import React from "react";
import ProgressBar from "./form/ProgressBar";
import FormActions from "./FormActions";
import { useProductOrderFlow } from "@/contexts/prodouctOrderFlowContext";
import PriceCalculationResult from "./PriceCalculationResult";
import { useFormContext } from "react-hook-form";

const ProductOrderFlow = () => {
  const {
    formBodies,
    currentStep,
    setCurrentStep,
    priceCalculationResult,
    isPriceCalculating,
  } = useProductOrderFlow();
  const { handleSubmit } = useFormContext();
  return (
    <form
      className="max-w-4xl mx-auto p-4"
      onSubmit={handleSubmit(
        (data) => {
          console.log(data);
          setCurrentStep((prev) => prev + 1);
        },
        (error) => console.log(error)
      )}
    >
      {/* Progress Steps */}
      <ProgressBar options={formBodies} currentStep={currentStep} />

      <div className="min-h-[60vh]">
        {/* Form body*/}
        {formBodies.map(
          (option) =>
            option.step === currentStep && option.render?.(option.step)
        )}
      </div>
      {currentStep == 2 && (
        <PriceCalculationResult
          {...priceCalculationResult}
          isPriceCalculating={isPriceCalculating}
        />
      )}

      {/* Next Button */}
      <FormActions />
    </form>
  );
};

export default ProductOrderFlow;

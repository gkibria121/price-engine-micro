"use client";
import React from "react";
import ProgressBar from "./form/ProgressBar";
import FormActions from "./FormActions";
import PriceCalculationResult from "./PriceCalculationResult";
import Loading from "./Loading";
import { useProductOrderFlow } from "@/hooks/useProductOrderFlow";

const ProductOrderFlow = () => {
  const { formBodies, currentStep, isLoading, priceCalculationStep } =
    useProductOrderFlow();

  return (
    <form className="max-w-4xl mx-auto p-4">
      {/* Progress Steps */}
      <ProgressBar options={formBodies} currentStep={currentStep} />

      {isLoading ? (
        <div className="w-full   flex justify-center items-center h-[60vh]">
          <Loading radius={40} />
        </div>
      ) : (
        <>
          <div className="min-h-[40vh]">
            {/* Form body*/}
            {formBodies.map(
              (option) =>
                option.step === currentStep && option.render?.(option.step)
            )}
          </div>
          {currentStep == priceCalculationStep && <PriceCalculationResult />}
          {/* Next Button */}
          <FormActions />
        </>
      )}
    </form>
  );
};

export default ProductOrderFlow;

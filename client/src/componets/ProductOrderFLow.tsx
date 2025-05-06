"use client";
import React from "react";
import ProgressBar from "./form/ProgressBar";
import FormActions from "./FormActions";
import { useProductOrderFlow } from "@/contexts/prodouctOrderFlowContext";
import PriceCalculationResult from "./PriceCalculationResult";
import { useFormContext } from "react-hook-form";
import Loading from "./Loading";

const ProductOrderFlow = () => {
  const {
    formBodies,
    currentStep,
    setCurrentStep,
    priceCalculationResult,
    isPriceCalculating,
    setLoading,
    isLoading,
  } = useProductOrderFlow();

  const { handleSubmit } = useFormContext();
  return (
    <form
      className="max-w-4xl mx-auto p-4"
      onSubmit={handleSubmit(
        () => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 500);
          setCurrentStep((prev) => prev + 1);
        },
        (error) => console.log(error)
      )}
    >
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
          {currentStep == 2 && (
            <PriceCalculationResult
              {...priceCalculationResult}
              isPriceCalculating={isPriceCalculating}
            />
          )}
          {/* Next Button */}
          <FormActions />
        </>
      )}
    </form>
  );
};

export default ProductOrderFlow;

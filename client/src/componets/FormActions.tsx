import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import Button from "./Button";
import { useProductOrderFlow } from "@/contexts/prodouctOrderFlowContext";

function FormActions() {
  const {
    finalStep,
    firstStep,
    currentStep,
    handleCalculatePriceClick,
    priceCalculationStep,
    setCurrentStep,
  } = useProductOrderFlow();

  return (
    <div
      className={`flex mt-8 justify-${
        currentStep !== firstStep ? "between" : "end"
      }`}
    >
      {currentStep !== firstStep && (
        <Button
          type="btnSecondary"
          className="flex items-center"
          buttonType="button"
          onClick={() => setCurrentStep((prev) => prev - 1)}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
      )}
      {currentStep === priceCalculationStep && (
        <Button
          type="btnSecondary"
          className="ml-auto"
          buttonType="button"
          onClick={handleCalculatePriceClick}
        >
          Calculate Price
        </Button>
      )}
      {currentStep !== finalStep && (
        <Button type="btnPrimary" className="flex items-center">
          Next
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

export default FormActions;

import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import Button from "./Button";
import { useProductOrderFlow } from "@/hooks/useProductOrderFlow";
import useFormAction from "@/hooks/useFormAction";

function FormActions() {
  const { finalStep, firstStep, currentStep } = useProductOrderFlow();
  const { handleBackButtonClick, handleNextButtonClick } = useFormAction();
  return (
    <div
      className={`flex mt-2 justify-${
        currentStep !== firstStep ? "between" : "end"
      }`}
    >
      {currentStep !== firstStep && (
        <Button
          type="btnSecondary"
          className="flex items-center"
          buttonType="button"
          onClick={handleBackButtonClick}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
      )}
      {currentStep !== finalStep && (
        <Button
          type="btnPrimary"
          className="flex items-center"
          buttonType="button"
          onClick={handleNextButtonClick}
        >
          Next
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

export default FormActions;

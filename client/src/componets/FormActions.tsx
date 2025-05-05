import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import Button from "./Button";
import { useProductOrderFlow } from "@/contexts/prodouctOrderFlowContext";

function FormActions() {
  const { finalStep, firstStep, currentStep, setCurrentStep } =
    useProductOrderFlow();
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
          onClick={() => setCurrentStep((prev) => prev - 1)}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
      )}
      {currentStep !== finalStep && (
        <Button
          type="btnPrimary"
          className="flex items-center"
          onClick={() => setCurrentStep((prev) => prev + 1)}
        >
          Next
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

export default FormActions;

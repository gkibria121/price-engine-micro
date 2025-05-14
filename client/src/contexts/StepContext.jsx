"use client";
import React, { createContext, useContext, useState } from "react";

const formBodies = [
  {
    step: 1,
    label: "Product",
    render: (key) => <ProductSelectionForm key={key} />,
  },
  {
    step: 2,
    label: "Delivery Details",
    render: (key) => <DeliverySelectionForm key={key} />,
  },
  {
    step: 3,
    label: "Product Details",
    render: (key) => <ProductAttributeSelection key={key} />,
  },
  {
    step: 4,
    label: "Upload Design File (Optional)",
    render: (key) => <div key={key}> No elements</div>,
  },
  {
    step: 5,
    label: "Final",
    render: (key) => <div key={key}> No elements</div>,
  },
];

const StepContext = createContext(undefined);

export const StepProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const finalStep = formBodies[formBodies.length - 1].step;
  const firstStep = formBodies[0].step;
  const priceCalculationStep = 4;

  return (
    <StepContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        formBodies,
        finalStep,
        firstStep,
        priceCalculationStep,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};

export const useStepFlow = () => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStepFlow must be used within a StepProvider");
  }
  return context;
};

"use client";
import ProductSelectionForm from "@/componets/ProductSelectionForm";
import React, { createContext, useContext, useState, ReactNode } from "react";
type OptionType = {
  step: number;
  label: string;
  render: (key: number) => React.JSX.Element;
};
// Define the shape of your context
interface ProductOrderFlowContextType {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  options: OptionType[];
  finalStep: number;
  firstStep: number;
}

// Create context
const ProductOrderFlowContext = createContext<
  ProductOrderFlowContextType | undefined
>(undefined);

// Provider component
export const ProductOrderFlowProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const options = [
    {
      step: 1,
      label: "Product",
      /* Product Selection Form */
      render: (key: number) => <ProductSelectionForm key={key} />,
    },
    {
      step: 2,
      label: "Delivery Details",
      render: (key: number) => <div key={key}> No elements</div>,
    },
    {
      step: 3,
      label: "Upload Design File (Optional)",
      render: (key: number) => <div key={key}> No elements</div>,
    },
    {
      step: 4,
      label: "Final",
      render: (key: number) => <div key={key}> No elements</div>,
    },
  ];
  const finalStep = options[options.length - 1].step;
  const firstStep = options[0].step;
  return (
    <ProductOrderFlowContext.Provider
      value={{ currentStep, options, setCurrentStep, finalStep, firstStep }}
    >
      {children}
    </ProductOrderFlowContext.Provider>
  );
};

export const useProductOrderFlow = () => {
  const context = useContext(ProductOrderFlowContext);
  if (!context) {
    throw new Error(
      "useProductOrderFlow must be used within a ProductOrderFlowProvider"
    );
  }
  return context;
};

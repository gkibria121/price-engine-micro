"use client";
import DeliverySelectionForm from "@/componets/form/DeliverySelectionForm";
import ProductSelectionForm from "@/componets/form/ProductSelectionForm";
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
  priceCalculationStep: number;
}
const pricingRuleOptions = [
  {
    attribute: "Sides",
    inputType: "radio",
    required: true,
    description: "",
    hasOther: false,
    default: 2,
    values: ["Single Side", "Double Side"],
  },
  {
    attribute: "Orientation",
    required: true,
    description: "",
    inputType: "radio",
    hasOther: false,
    default: 2,
    values: ["Portrait", "Landscape"],
  },
  {
    attribute: "Paper Thickness",
    required: false,
    inputType: "radio",
    description:
      "GSM stands for 'Grams per Square Meter'. The higher the GSM number, the heavier the paper.",
    hasOther: true,
    default: 2,
    values: [
      "130 GSM (Thin)",
      "170 GSM (Medium)",
      "250 GSM (Moderately Thick)",
      "300 GSM (Thick)",
      "350 GSM (Extra Thick)",
    ],
  },
  {
    attribute: "Finished Size",
    required: true,
    inputType: "radio",
    description: "",
    hasOther: true,
    default: 2,
    values: ["A6", "A5", "A4"],
  },
  {
    attribute: "Paper Type",
    required: true,
    description: "",
    inputType: "radio",
    hasOther: true,
    default: 2,
    values: ["Silk (Matt)", "Gloss"],
  },
];
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
      render: (key: number) => (
        <ProductSelectionForm
          key={key}
          pricingRuleOptions={pricingRuleOptions}
        />
      ),
    },
    {
      step: 2,
      label: "Delivery Details",
      render: (key: number) => <DeliverySelectionForm key={key} />,
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
  const priceCalculationStep = 2;
  const finalStep = options[options.length - 1].step;
  const firstStep = options[0].step;
  return (
    <ProductOrderFlowContext.Provider
      value={{
        currentStep,
        options,
        setCurrentStep,
        finalStep,
        firstStep,
        priceCalculationStep,
      }}
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

"use client";
import DeliverySelectionForm from "@/componets/form/DeliverySelectionForm";
import ProductSelectionForm from "@/componets/form/ProductSelectionForm";
import { ProductOrderFlowFormSchema } from "@/schemas/zod-schema";
import {
  PricingRuleSelectionType,
  ProductOrderFlowFormType,
  VendorProduct,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
type FormBodyType = {
  step: number;
  label: string;
  render: (key: number) => React.JSX.Element;
};
// Define the shape of your context
interface ProductOrderFlowContextType {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  formBodies: FormBodyType[];
  finalStep: number;
  firstStep: number;
  priceCalculationStep: number;
  vendorProducts: VendorProduct[];
  pricingRuleOptions: PricingRuleSelectionType[];
}
const pricingRuleOptions = [
  {
    attribute: "Sides",
    inputType: "radio",
    required: true,
    description: "",
    hasOther: false,
    default: 1,
    values: ["Single Side", "Double Side"],
  },
  {
    attribute: "Orientation",
    required: true,
    description: "",
    inputType: "radio",
    hasOther: false,
    default: 0,
    values: ["Portrait", "Landscape"],
  },
  {
    attribute: "Paper Thickness",
    required: false,
    inputType: "radio",
    description:
      "GSM stands for 'Grams per Square Meter'. The higher the GSM number, the heavier the paper.",
    hasOther: true,
    default: 1,
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
    default: 0,
    values: ["Silk (Matt)", "Gloss"],
  },
];
const formBodies = [
  {
    step: 1,
    label: "Product",
    /* Product Selection Form */
    render: (key: number) => <ProductSelectionForm key={key} />,
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
// Create context
const ProductOrderFlowContext = createContext<
  ProductOrderFlowContextType | undefined
>(undefined);

// Provider component
export const ProductOrderFlowProvider = ({
  children,
  vendorProducts,
}: {
  children: ReactNode;
  vendorProducts: VendorProduct[];
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const priceCalculationStep = 2;
  const finalStep = formBodies[formBodies.length - 1].step;
  const firstStep = formBodies[0].step;

  const pricingRuls = pricingRuleOptions.map((rule) => ({
    attribute: rule.attribute,
    value: rule.values[rule.default],
  }));
  const productOrderFlowDefaultValues: ProductOrderFlowFormType = {
    product: "",
    quantity: 10,
    pricingRules: pricingRuls,
  };
  const medhods = useForm({
    resolver: zodResolver(ProductOrderFlowFormSchema),
    defaultValues: productOrderFlowDefaultValues,
  });

  return (
    <ProductOrderFlowContext.Provider
      value={{
        currentStep,
        formBodies,
        setCurrentStep,
        finalStep,
        firstStep,
        pricingRuleOptions,
        priceCalculationStep,
        vendorProducts,
      }}
    >
      <FormProvider {...medhods}>{children}</FormProvider>
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

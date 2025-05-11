"use client";
import DeliverySelectionForm from "@/componets/form/DeliverySelectionForm";
import ProductSelectionForm from "@/componets/form/ProductSelectionForm";
import { ProductOrderFlowFormSchema } from "@/schemas/zod-schema";
import {
  DeliverySlot,
  PriceCalculationResultType,
  ProductOrderFlowFormType,
  VendorProduct,
} from "@/types";
import { getPricingRuleMetas } from "@/util/funcitons";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
type FormBodyType = {
  step: number;
  label: string;
  render: (key: number) => React.JSX.Element;
};
// Define the shape of your context

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
interface ProductOrderFlowContextType {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  formBodies: FormBodyType[];
  finalStep: number;
  firstStep: number;
  deliverySlots: DeliverySlot[];
  priceCalculationStep: number;
  vendorProducts: VendorProduct[];
  priceCalculationResult: PriceCalculationResultType;
  setPriceCalculationResult: React.Dispatch<
    React.SetStateAction<PriceCalculationResultType>
  >;
  isPriceCalculating: boolean;
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPriceCalculating: React.Dispatch<React.SetStateAction<boolean>>;
}
// Provider component
export const ProductOrderFlowProvider = ({
  children,
  vendorProducts,
  defaultVendorProduct,
  deliverySlots,
}: {
  children: ReactNode;
  deliverySlots: DeliverySlot[];
  vendorProducts: VendorProduct[];
  defaultVendorProduct?: VendorProduct;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const priceCalculationStep = 2;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isPriceCalculating, setIsPriceCalculating] = useState<boolean>(false);
  const finalStep = formBodies[formBodies.length - 1].step;
  const firstStep = formBodies[0].step;
  const pricingRuleMetas = getPricingRuleMetas(
    defaultVendorProduct.pricingRules
  );
  const [priceCalculationResult, setPriceCalculationResult] =
    useState<PriceCalculationResultType>({
      productName: "",
      quantity: 0,
    });

  const productOrderFlowDefaultValues: ProductOrderFlowFormType = {
    deliveryMethod: { label: deliverySlots[0].label ?? "" },
    product: defaultVendorProduct?.product.id ?? "",
    quantity: 0,
    pricingRules: [
      ...pricingRuleMetas.map((pro) => ({
        attribute: pro.attribute,
        value: pro.values[pro.default],
      })),
    ],
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
        priceCalculationStep,
        vendorProducts,
        deliverySlots,
        priceCalculationResult,
        setPriceCalculationResult,
        isPriceCalculating,
        setIsPriceCalculating,
        isLoading,
        setLoading,
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

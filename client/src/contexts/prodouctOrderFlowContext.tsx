"use client";
import DeliverySelectionForm from "@/componets/form/DeliverySelectionForm";
import ProductSelectionForm from "@/componets/form/ProductSelectionForm";
import { ProductOrderFlowFormSchema } from "@/schemas/zod-schema";
import { calculatePrice } from "@/services/priceCalculationService";
import {
  DeliverySlot,
  PriceCalculationResultType,
  ProductOrderFlowFormType,
  VendorProduct,
} from "@/types";
import { getPricingRuleOptions } from "@/util/funcitons";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
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
  handleCalculatePriceClick: () => Promise<void>;
  isPriceCalculating: boolean;
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleNextButtonClick: () => void;
  handleBackButtonClick: () => void;
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
  const pricingRuleOptions = getPricingRuleOptions(defaultVendorProduct);
  const productOrderFlowDefaultValues: ProductOrderFlowFormType = {
    deliveryMethod: { label: deliverySlots[0].label ?? "" },
    product: defaultVendorProduct?.product.id ?? "",
    quantity: 0,
    pricingRules: [
      ...pricingRuleOptions.map((pro) => ({
        attribute: pro.attribute,
        value: pro.values[pro.default],
      })),
    ],
  };
  const medhods = useForm({
    resolver: zodResolver(ProductOrderFlowFormSchema),
    defaultValues: productOrderFlowDefaultValues,
  });
  const [priceCalculationResult, setPriceCalculationResult] =
    useState<PriceCalculationResultType>({
      productName: "",
      quantity: 0,
    });
  const { getValues, trigger } = medhods;

  const handleCalculatePriceClick = async () => {
    setIsPriceCalculating(true);
    const productId = getValues("product");
    const deliveryMethod = getValues("deliveryMethod") as { label: string };
    const quantity = getValues("quantity");
    const vendorId = vendorProducts.find((vp) => vp.product.id === productId)
      .vendor.id;
    const attributes = getValues("pricingRules").map((pr) => ({
      name: pr.attribute,
      value: pr.value,
    }));

    try {
      const resultRsp = await calculatePrice({
        productId,
        vendorId,
        attributes,
        deliveryMethod,
        quantity,
      });
      if (!resultRsp.ok) {
        throw new Error(
          (await resultRsp.json()).message ?? "something went wrong!"
        );
      }

      setPriceCalculationResult(
        (await resultRsp.json()) as PriceCalculationResultType
      );
    } catch (error) {
      if (error instanceof Error) {
        setPriceCalculationResult((prev) => ({
          productName: prev.productName,
          quantity: prev.quantity,
        }));
        toast(error.message, {
          type: "error",
        });
      }
    } finally {
      setTimeout(() => {
        setIsPriceCalculating(false);
      }, 500);
    }
  };

  const handleNextButtonClick = async () => {
    if (currentStep === firstStep) {
      const validate = await trigger();
      if (!validate) return;
      const productId = getValues("product");
      const product = vendorProducts.find(
        (vp) => vp.product.id === productId
      )?.product;
      const quantity = getValues("quantity");
      setPriceCalculationResult({
        productName: product.name,
        quantity: quantity,
      });
      setCurrentStep((prev) => prev + 1);
    }
  };
  const handleBackButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    setCurrentStep((prev) => prev - 1);
  };
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
        handleCalculatePriceClick,
        isPriceCalculating,
        isLoading,
        setLoading,
        handleBackButtonClick,
        handleNextButtonClick,
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

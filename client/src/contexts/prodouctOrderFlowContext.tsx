"use client";
import DeliverySelectionForm from "@/componets/form/DeliverySelectionForm";
import ProductAttributeSelection from "@/componets/form/ProductAttributeSelection";
import ProductSelectionForm from "@/componets/form/ProductSelectionForm";
import { ProductOrderFlowFormSchema } from "@/schemas/zod-schema";
import {
  DeliverySlot,
  PriceCalculationResultType,
  PricingRuleMeta,
  Product,
  ProductOrderFlowFormType,
  VendorProduct,
  VendorProductFormType,
} from "@/types";
import { formatDate } from "@/util/funcitons";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
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
    label: "Product Details",
    /* Product Selection Form */
    render: (key: number) => <ProductAttributeSelection key={key} />,
  },
  {
    step: 4,
    label: "Upload Design File (Optional)",
    render: (key: number) => <div key={key}> No elements</div>,
  },
  {
    step: 5,
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
  isProductLoading: boolean;
  setProductLoading: React.Dispatch<React.SetStateAction<boolean>>;
  pricingRuleMetas: VendorProductFormType["vendorProducts"][number]["pricingRuleMetas"];
  setPricingRuleMetas: React.Dispatch<
    React.SetStateAction<
      VendorProductFormType["vendorProducts"][number]["pricingRuleMetas"]
    >
  >;
  products: Product[];
  deliverySlots: DeliverySlot[];
  setDeliverySlots: React.Dispatch<React.SetStateAction<DeliverySlot[]>>;
}
// Provider component
export const ProductOrderFlowProvider = ({
  children,
  vendorProducts,
  defaultVendorProduct,
  products,
}: {
  children: ReactNode;
  vendorProducts: VendorProduct[];
  defaultVendorProduct?: VendorProduct;
  products: Product[];
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const priceCalculationStep = 4;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isProductLoading, setProductLoading] = useState<boolean>(false);
  const [isPriceCalculating, setIsPriceCalculating] = useState<boolean>(false);
  const finalStep = formBodies[formBodies.length - 1].step;
  const firstStep = formBodies[0].step;
  const pricingRuleMetasDefault = defaultVendorProduct?.pricingRuleMetas ?? [];
  const [priceCalculationResult, setPriceCalculationResult] =
    useState<PriceCalculationResultType>({
      productName: "",
      quantity: 0,
    });
  // initialize product order flow
  const productOrderFlowDefaultValues: ProductOrderFlowFormType = {
    deliveryMethod: {
      label: "",
      otherValue: formatDate(new Date()),
    },
    product: defaultVendorProduct?.product.id ?? "",
    quantity: 0,
    pricingRules: [
      ...pricingRuleMetasDefault.map((pro) => ({
        attribute: pro.attribute,
        value: pro.values[pro.default],
      })),
    ],
  };
  const medhods = useForm({
    resolver: zodResolver(ProductOrderFlowFormSchema),
    defaultValues: productOrderFlowDefaultValues,
  });
  const { setValue, control } = medhods;
  const productId = useWatch({ name: "product", control });
  const [pricingRuleMetas, setPricingRuleMetas] = useState<PricingRuleMeta[]>(
    []
  );

  // show loading screen
  useEffect(() => {
    setProductLoading(true);
    const loadingTimeout = setTimeout(() => {
      setProductLoading(false);
    }, 500);
    return () => clearTimeout(loadingTimeout);
  }, [productId]);

  // show set default pricing rules
  useEffect(() => {
    setValue("pricingRules", [
      ...pricingRuleMetas.map((pro) => ({
        attribute: pro.attribute,
        value: pro.values[pro.default],
      })),
    ]);
  }, [productId, pricingRuleMetas, setValue]);

  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>(
    [] as DeliverySlot[]
  );
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
        priceCalculationResult,
        setPriceCalculationResult,
        isPriceCalculating,
        setIsPriceCalculating,
        isLoading,
        setLoading,
        pricingRuleMetas,
        isProductLoading,
        setProductLoading,
        deliverySlots,
        setDeliverySlots,
        products,
        setPricingRuleMetas,
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

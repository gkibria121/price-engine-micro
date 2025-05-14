// File: contexts/ProductOrderFlowProvider.js
"use client";
import React, { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductOrderFlowFormSchema } from "@/schemas/zod-schema";
import { Product, ProductOrderFlowFormType, VendorProduct } from "@/types";
import { StepProvider } from "./StepContext";
import { ProductProvider } from "./ProductContext";
import { DeliveryProvider } from "./DeliveryContext";
import { PricingProvider } from "./PricingContext";
import { LoadingProvider } from "./LoadingContext";

export const ProductOrderFlowProvider = ({
  children,
  vendorProducts,
  defaultVendorProduct,
  products,
}: PropsWithChildren & {
  products: Product[];
  vendorProducts: VendorProduct[];
  defaultVendorProduct: VendorProduct;
}) => {
  // initialize product order flow with default values
  const pricingRuleMetasDefault = defaultVendorProduct?.pricingRuleMetas || [];

  const productOrderFlowDefaultValues: ProductOrderFlowFormType = {
    deliveryMethod: {
      label: "",
      otherValue: "",
    },
    product: defaultVendorProduct?.product.id || "",
    quantity: 0,
    pricingRules: [
      ...pricingRuleMetasDefault.map((pro) => ({
        attribute: pro.attribute,
        value: pro.values[pro.default],
      })),
    ],
  };

  const methods = useForm({
    resolver: zodResolver(ProductOrderFlowFormSchema),
    defaultValues: productOrderFlowDefaultValues,
  });

  return (
    <FormProvider {...methods}>
      <LoadingProvider>
        <StepProvider>
          <PricingProvider>
            <DeliveryProvider>
              <ProductProvider
                products={products}
                vendorProducts={vendorProducts}
                defaultVendorProduct={defaultVendorProduct}
              >
                {children}
              </ProductProvider>
            </DeliveryProvider>
          </PricingProvider>
        </StepProvider>
      </LoadingProvider>
    </FormProvider>
  );
};

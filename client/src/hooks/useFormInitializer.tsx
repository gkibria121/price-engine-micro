// File: hooks/useFormInitializer.js
"use client";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { formatDate } from "@/util/funcitons";
import { ProductOrderFlowFormType, VendorProduct } from "@/types";

export const useFormInitializer = (defaultVendorProduct: VendorProduct) => {
  const { reset } = useFormContext<ProductOrderFlowFormType>();

  useEffect(() => {
    const pricingRuleMetasDefault =
      defaultVendorProduct?.pricingRuleMetas || [];

    const productOrderFlowDefaultValues = {
      deliveryMethod: {
        label: "",
        otherValue: formatDate(new Date()),
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

    reset(productOrderFlowDefaultValues);
  }, [defaultVendorProduct, reset]);
};

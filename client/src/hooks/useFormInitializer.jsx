// File: hooks/useFormInitializer.js
"use client";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { formatDate } from "@/util/funcitons";

export const useFormInitializer = (defaultVendorProduct) => {
  const { reset } = useFormContext();

  useEffect(() => {
    const pricingRuleMetasDefault = defaultVendorProduct?.pricingRuleMetas || [];
    
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

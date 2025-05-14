
// File: hooks/useProductOrderFlow.js
"use client";
import { useStepFlow } from "../contexts/StepContext";
import { useProductContext } from "../contexts/ProductContext";
import { useDeliveryContext } from "../contexts/DeliveryContext";
import { usePricingContext } from "../contexts/PricingContext";
import { useLoadingContext } from "../contexts/LoadingContext";

export const useProductOrderFlow = () => {
  const stepContext = useStepFlow();
  const productContext = useProductContext();
  const deliveryContext = useDeliveryContext();
  const pricingContext = usePricingContext();
  const loadingContext = useLoadingContext();

  return {
    ...stepContext,
    ...productContext,
    ...deliveryContext,
    ...pricingContext,
    ...loadingContext,
  };
};

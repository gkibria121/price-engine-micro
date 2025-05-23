import { PriceCalculationResultType, ProductOrderFlowFormType } from "@/types";
import { useFormContext } from "react-hook-form";
import { useProductOrderFlow } from "./useProductOrderFlow";
import { calculatePrice } from "@/services/priceCalculationService";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useCallback } from "react";

function useFormAction() {
  const {
    currentStep,
    vendorProduct,
    setLoading,
    setPriceCalculationResult,
    setCurrentStep,
    setIsPriceCalculating,
    formBodies,
  } = useProductOrderFlow();
  const { trigger, getValues } = useFormContext<ProductOrderFlowFormType>();
  const handleNextButtonClick = async () => {
    const fieldsToTrigger = formBodies.find(
      (body) => body.step === currentStep
    )?.trigger;

    const validate = await trigger(fieldsToTrigger);
    if (!validate) return;
    setLoading(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 500);
  };

  const handleBackButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    setCurrentStep((prev) => prev - 1);
  };

  const handleCalculatePriceClick = useCallback(async () => {
    setIsPriceCalculating(true);
    const productId = vendorProduct.product.id;
    const deliveryMethod = getValues("deliveryMethod") as { label: string };
    const quantity = getValues("quantity");
    const vendorId = vendorProduct.vendor.id;
    const attributes = getValues("pricingRules").map((pr) => ({
      name: pr.attribute,
      value: pr.value,
    }));

    try {
      const result = await calculatePrice({
        productId,
        vendorId,
        attributes,
        deliveryMethod,
        quantity,
      });

      setPriceCalculationResult(result as PriceCalculationResultType);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setPriceCalculationResult((prev) => ({
          productName: prev.productName,
          quantity: prev.quantity,
        }));
        toast(error.response.data?.message, {
          type: "error",
        });
      }
    } finally {
      setTimeout(() => {
        setIsPriceCalculating(false);
      }, 500);
    }
  }, [
    setIsPriceCalculating,
    vendorProduct,
    getValues,
    setPriceCalculationResult,
  ]);

  return {
    handleBackButtonClick,
    handleNextButtonClick,
    handleCalculatePriceClick,
  };
}

export default useFormAction;

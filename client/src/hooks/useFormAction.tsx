import { PriceCalculationResultType, ProductOrderFlowFormType } from "@/types";
import { useFormContext } from "react-hook-form";
import { useProductOrderFlow } from "./useProductOrderFlow";
import { calculatePrice } from "@/services/priceCalculationService";
import { toast } from "react-toastify";

function useFormAction() {
  const {
    currentStep,
    vendorProducts,
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

    setCurrentStep((prev) => prev + 1);
  };

  const handleBackButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    setCurrentStep((prev) => prev - 1);
  };

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
      const result = await calculatePrice({
        productId,
        vendorId,
        attributes,
        deliveryMethod,
        quantity,
      });

      setPriceCalculationResult(result as PriceCalculationResultType);
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

  return {
    handleBackButtonClick,
    handleNextButtonClick,
    handleCalculatePriceClick,
  };
}

export default useFormAction;

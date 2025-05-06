import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import Button from "./Button";
import { useProductOrderFlow } from "@/contexts/prodouctOrderFlowContext";
import { useFormContext } from "react-hook-form";
import { PriceCalculationResultType, ProductOrderFlowFormType } from "@/types";
import { calculatePrice } from "@/services/priceCalculationService";
import { toast } from "react-toastify";

function FormActions() {
  const {
    finalStep,
    firstStep,
    currentStep,
    priceCalculationStep,
    vendorProducts,
    setLoading,
    setPriceCalculationResult,
    setCurrentStep,
    setIsPriceCalculating,
  } = useProductOrderFlow();
  const { trigger, getValues } = useFormContext<ProductOrderFlowFormType>();
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
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
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
  return (
    <div
      className={`flex mt-2 justify-${
        currentStep !== firstStep ? "between" : "end"
      }`}
    >
      {currentStep !== firstStep && (
        <Button
          type="btnSecondary"
          className="flex items-center"
          buttonType="button"
          onClick={handleBackButtonClick}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
      )}
      {currentStep === priceCalculationStep && (
        <Button
          type="btnSecondary"
          className="ml-auto"
          buttonType="button"
          onClick={handleCalculatePriceClick}
        >
          Calculate Price
        </Button>
      )}
      {currentStep !== finalStep && (
        <Button
          type="btnPrimary"
          className="flex items-center"
          buttonType="button"
          onClick={handleNextButtonClick}
        >
          Next
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

export default FormActions;

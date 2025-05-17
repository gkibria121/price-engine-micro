import React, { useEffect } from "react";
import Loading from "./Loading";
import { useProductOrderFlow } from "@/hooks/useProductOrderFlow";
import { useFormContext } from "react-hook-form";
import { ProductOrderFlowFormType } from "@/types";

const PriceCalculationResult = () => {
  const {
    priceCalculationResult: {
      productName,
      quantity,
      breakdown = {
        deliveryCharge: 0,
      },
      totalPrice = 0,
    },
    isPriceCalculating,
    setPriceCalculationResult,
    vendorProducts,
  } = useProductOrderFlow();
  const { getValues } = useFormContext<ProductOrderFlowFormType>();
  useEffect(() => {
    const productId = getValues("product");
    const product = vendorProducts.find(
      (vp) => vp.product.id === productId
    )?.product;
    const quantity = getValues("quantity");
    setPriceCalculationResult({
      productName: product.name,
      quantity: quantity,
    });
  }, [getValues, setPriceCalculationResult, vendorProducts]);
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-[30vh]">
      {isPriceCalculating ? (
        <div className="flex justify-center items-center h-full">
          <Loading isFullScreen={false} radius={20} />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Product</span>
            <span>{productName}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Quantity</span>
            <span>{quantity}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Delivery Charge</span>
            <span>{breakdown?.deliveryCharge} £</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total Price</span>
            <span>{totalPrice.toFixed(3)} £</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceCalculationResult;

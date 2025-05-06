import { PriceCalculationResultType } from "@/types";
import React from "react";
import Loading from "./Loading";

type PriceCalculationResultProps = PriceCalculationResultType & {
  isPriceCalculating: boolean;
};

const PriceCalculationResult: React.FC<PriceCalculationResultProps> = ({
  productName = "",
  quantity = 5,
  totalPrice = 0,
  breakdown = {
    deliveryCharge: 0,
    attributeCost: 0,
    basePrice: 0,
  },
  isPriceCalculating,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-[30vh]">
      {isPriceCalculating ? (
        <div className="flex justify-center items-center h-full">
          <Loading isFullScreen={false} radius={5} />
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
            <span>{breakdown?.deliveryCharge} $</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total Price</span>
            <span>{totalPrice.toFixed(3)} $</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceCalculationResult;

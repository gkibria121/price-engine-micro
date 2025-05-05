import React from "react";

interface PriceCalculationResultProps {
  product?: string;
  quantity?: number;
  deliveryCharge?: number;
  totalPrice?: number;
}

const PriceCalculationResult: React.FC<PriceCalculationResultProps> = ({
  product = "Flyers",
  quantity = 5,
  deliveryCharge = 10,
  totalPrice = 547.32,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Product</span>
          <span>{product}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Quantity</span>
          <span>{quantity}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Delivery Charge</span>
          <span>{deliveryCharge}$</span>
        </div>

        <div className="flex justify-between font-semibold">
          <span>Total Price</span>
          <span>{totalPrice.toFixed(3)} $</span>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculationResult;

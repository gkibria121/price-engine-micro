import { useProductOrderFlow } from "@/contexts/prodouctOrderFlowContext";
import { ProductOrderFlowFormType } from "@/types";
import React from "react";
import { useFormContext } from "react-hook-form";
import RadioBox from "./RadioBox";

const DeliverySelection = () => {
  const { deliverySlots } = useProductOrderFlow();
  const { register } = useFormContext<ProductOrderFlowFormType>();
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-lg font-medium mb-4">
        When would you like to receive your item?*
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        To receive express same-day delivery, please continue to fill out the
        form and let us know your preferred delivery time in the comment section
      </p>
      <RadioBox title="">
        {deliverySlots.map((slot) => (
          <RadioBox.RadioInput
            key={slot.label}
            label={slot.label}
            value={slot.label}
            className="text-black"
            {...register("deliveryMethod.label")}
          />
        ))}
      </RadioBox>
    </div>
  );
};

export default DeliverySelection;

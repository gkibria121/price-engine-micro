import { useProductOrderFlow } from "@/contexts/prodouctOrderFlowContext";
import { ProductOrderFlowFormType } from "@/types";
import React from "react";
import { useFormContext, useFormState } from "react-hook-form";
import RadioBox from "./RadioBox";
import DatePicker from "./DatePicker";

const DeliverySelection = () => {
  const { deliverySlots } = useProductOrderFlow();
  const { register, watch } = useFormContext<ProductOrderFlowFormType>();
  const { errors } = useFormState<ProductOrderFlowFormType>({
    name: `deliveryMethod`,
  });
  const deliveryMethod = watch("deliveryMethod");
  const showCustom = deliveryMethod.label === "other";
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-lg font-medium mb-4">
        When would you like to receive your item?
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
        <div className="">
          <RadioBox.RadioInput
            key={"other"}
            label={"I have a custom delivery deadline"}
            value={"other"}
            className="text-black"
            {...register("deliveryMethod.label")}
          />
          <div
            className={`w-fit overflow-hidden transition-all duration-300 ease-in-out ${
              showCustom ? "max-h-[200px] py-2" : "max-h-0 py-0"
            }`}
          >
            <DatePicker
              isTime={true}
              error={errors?.deliveryMethod?.otherValue?.message?.toString()}
              {...register("deliveryMethod.otherValue", {
                valueAsDate: false,
              })}
            />
          </div>
        </div>
      </RadioBox>
    </div>
  );
};

export default DeliverySelection;

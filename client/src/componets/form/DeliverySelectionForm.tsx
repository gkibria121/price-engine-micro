import { useProductOrderFlow } from "@/hooks/useProductOrderFlow";
import { ProductOrderFlowFormType } from "@/types";
import React from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import RadioBox from "./RadioBox";
import DatePicker from "./DatePicker";
import { getDeliverySlots } from "@/services/deliverySlots";
import FieldError from "./FieldError";
import { useAsyncEffect } from "@/hooks/useAsyncEffect";

const DeliverySelection = () => {
  const { deliverySlots, setLoading, setDeliverySlots } = useProductOrderFlow();
  const { register, getValues } = useFormContext<ProductOrderFlowFormType>();
  const { errors } = useFormState<ProductOrderFlowFormType>({
    name: `deliveryMethod`,
  });
  const deliveryMethod = useWatch({ name: "deliveryMethod" });
  const showCustom = deliveryMethod.label === "other";
  // load delivery slots
  useAsyncEffect({
    asyncFn: async () => {
      const productId = getValues("product");
      return await getDeliverySlots(productId);
    },
    onSuccess: (data) => setDeliverySlots(data),
    onError: (err) => console.error("Failed to fetch delivery slots:", err),
    setLoading,
    delay: 200,
    deps: [getValues, setDeliverySlots, setLoading],
  });

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
              label="Delivery Date"
              isTime={true}
              error={errors?.deliveryMethod?.otherValue?.message?.toString()}
              {...register("deliveryMethod.otherValue", {
                required: "Please select a delivery date",
                validate: (value) => {
                  const isValid = !isNaN(Date.parse(value));
                  return isValid || "Please enter a valid date and time";
                },
              })}
            />
          </div>
        </div>
        {errors.deliveryMethod?.label?.message && (
          <FieldError> {errors.deliveryMethod.label.message}</FieldError>
        )}
      </RadioBox>
    </div>
  );
};

export default DeliverySelection;

import React from "react";
import ObjectListField from "./ObjectListField";
import TextField from "./TextField";
import { useFieldArray, useFormContext } from "react-hook-form";
import FieldError from "./FieldError";
import { VendorProductFormType } from "@/types";

function QuantityPricingsForm({
  readonly,
  formIndex,
}: {
  formIndex: number;
  readonly: boolean;
}) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<VendorProductFormType>();
  const {
    fields: quantityFields,
    append: appendQuantity,
    remove: removeQuantity,
  } = useFieldArray({
    control,
    name: `vendorProducts.${formIndex}.pricingRules`,
  });
  return (
    <ObjectListField
      readonly={readonly}
      defaultItem={{ quantity: 1, price: 0 }}
      label="Quantity Pricing"
      append={appendQuantity}
    >
      {quantityFields.map((field, index) => (
        <ObjectListField.Row key={field.id}>
          <ObjectListField.Col>
            <TextField
              label="Quantity"
              readonly={readonly}
              type="number"
              error={
                errors.vendorProducts?.[formIndex]?.quantityPricings?.[index]
                  ?.quantity?.message
              }
              {...register(
                `vendorProducts.${formIndex}.quantityPricings.${index}.quantity` as const,
                {
                  required: "This field is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Must be at least 1" },
                }
              )}
            />
          </ObjectListField.Col>

          <ObjectListField.Col>
            <TextField
              type="number"
              step="0.01"
              readonly={readonly}
              error={
                errors.vendorProducts?.[formIndex]?.quantityPricings?.[index]
                  ?.price?.message
              }
              {...register(
                `vendorProducts.${formIndex}.quantityPricings.${index}.price` as const,
                {
                  required: "This field is required",
                  valueAsNumber: true,
                }
              )}
              label="Price Per Unit"
            />
          </ObjectListField.Col>
          {!readonly && (
            <ObjectListField.Remove handleClick={() => removeQuantity(index)} />
          )}
        </ObjectListField.Row>
      ))}
      <input
        type="hidden"
        {...register(`vendorProducts.${formIndex}.quantityPricings`, {
          validate: (value) =>
            value.length > 0 || "At least one quantity pricing is required",
        })}
      />
      {errors.vendorProducts?.[formIndex]?.quantityPricings?.root?.message && (
        <FieldError>
          {errors.vendorProducts?.[
            formIndex
          ]?.quantityPricings?.root?.message?.toString()}
        </FieldError>
      )}
    </ObjectListField>
  );
}

export default QuantityPricingsForm;

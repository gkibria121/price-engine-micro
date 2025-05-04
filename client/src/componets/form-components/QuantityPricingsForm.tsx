import React from "react";
import ObjectListField from "./ObjectListField";
import TextField from "./TextField";
import { useFieldArray, useFormContext, useFormState } from "react-hook-form";
import { VendorProductFormType } from "@/types";

function QuantityPricingsForm({
  readonly,
  formIndex,
}: {
  formIndex: number;
  readonly: boolean;
}) {
  const { register } = useFormContext<VendorProductFormType>();
  const {
    fields: quantityFields,
    append: appendQuantity,
    remove: removeQuantity,
  } = useFieldArray({
    name: `vendorProducts.${formIndex}.quantityPricings`,
    rules: {
      validate: (value) =>
        value.length > 0 || "At least one quantity pricing is required",
    },
  });
  const { errors } = useFormState({
    name: `vendorProducts.${formIndex}.quantityPricings`,
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
          {!readonly && quantityFields.length > 1 && (
            <ObjectListField.Remove handleClick={() => removeQuantity(index)} />
          )}
        </ObjectListField.Row>
      ))}
    </ObjectListField>
  );
}

export default QuantityPricingsForm;

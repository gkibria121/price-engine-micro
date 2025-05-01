import React from "react";
import ObjectListField from "./ObjectListField";
import TextField from "./TextField";
import { useFieldArray, useFormContext } from "react-hook-form";
import FieldError from "./FieldError";

function QuantityPricingsForm({ readonly }: { readonly: boolean }) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const {
    fields: quantityFields,
    append: appendQuantity,
    remove: removeQuantity,
  } = useFieldArray({ control, name: "quantityPricings" });
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
              error={errors.quantityPricings?.[index]?.quantity?.message}
              {...register(`quantityPricings.${index}.quantity` as const, {
                required: "This field is required",
                valueAsNumber: true,
                min: { value: 1, message: "Must be at least 1" },
              })}
            />
          </ObjectListField.Col>

          <ObjectListField.Col>
            <TextField
              type="number"
              step="0.01"
              readonly={readonly}
              error={errors.quantityPricings?.[index]?.price?.message}
              {...register(`quantityPricings.${index}.price` as const, {
                required: "This field is required",
                valueAsNumber: true,
              })}
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
        {...register("quantityPricings", {
          validate: (value) =>
            value.length > 0 || "At least one quantity pricing is required",
        })}
      />
      {errors.quantityPricings?.root?.message && (
        <FieldError>
          {errors.quantityPricings?.root?.message?.toString()}
        </FieldError>
      )}
    </ObjectListField>
  );
}

export default QuantityPricingsForm;

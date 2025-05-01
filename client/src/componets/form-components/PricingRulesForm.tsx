import React from "react";
import ObjectListField from "./ObjectListField";
import TextField from "./TextField";
import { useFieldArray, useFormContext } from "react-hook-form";
import FieldError from "./FieldError";

function PricingRulesForm({ readonly }: { readonly: boolean }) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const {
    fields: pricingFields,
    append: appendPricing,
    remove: removePricing,
  } = useFieldArray({ control, name: "pricingRules" });
  console.log(errors);
  return (
    <ObjectListField
      readonly={readonly}
      defaultItem={{ attribute: "", value: "", price: 0 }}
      label="Pricing Rules"
      append={appendPricing}
    >
      {pricingFields.map((field, index) => (
        <ObjectListField.Row key={field.id}>
          <ObjectListField.Col>
            <TextField
              readonly={readonly}
              error={errors.pricingRules?.[index]?.attribute?.message}
              label="Attribute"
              {...register(`pricingRules.${index}.attribute` as const, {
                required: "This field is required",
              })}
            />
          </ObjectListField.Col>

          <ObjectListField.Col>
            <TextField
              label="Value"
              readonly={readonly}
              error={errors.pricingRules?.[index]?.value?.message}
              {...register(`pricingRules.${index}.value` as const, {
                required: "This field is required",
              })}
            />
          </ObjectListField.Col>

          <ObjectListField.Col>
            <TextField
              readonly={readonly}
              error={errors.pricingRules?.[index]?.price?.message}
              {...register(`pricingRules.${index}.price` as const, {
                required: "This field is required",
                valueAsNumber: true,
              })}
              label="Price Adjustment"
              type="number"
              step="0.01"
            />
          </ObjectListField.Col>
          {!readonly && (
            <ObjectListField.Remove handleClick={() => removePricing(index)} />
          )}
        </ObjectListField.Row>
      ))}
      <input
        type="hidden"
        {...register("pricingRules", {
          validate: (value) =>
            value.length > 0 || "At least one pricing rule is required",
        })}
      />
      {errors.pricingRules?.root?.message && (
        <FieldError>
          {errors.pricingRules?.root?.message?.toString()}
        </FieldError>
      )}
    </ObjectListField>
  );
}

export default PricingRulesForm;

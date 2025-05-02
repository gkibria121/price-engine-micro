import React from "react";
import ObjectListField from "./ObjectListField";
import TextField from "./TextField";
import { useFieldArray, useFormContext } from "react-hook-form";
import FieldError from "./FieldError";
import { VendorProductFormType } from "@/types";

function PricingRulesForm({
  readonly,
  formIndex,
}: {
  readonly: boolean;
  formIndex: number;
}) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<VendorProductFormType>();
  const {
    fields: pricingFields,
    append: appendPricing,
    remove: removePricing,
  } = useFieldArray({ control, name: `vendorProducts` });

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
              error={
                errors.vendorProducts?.[formIndex]?.pricingRules?.[index]
                  ?.attribute?.message
              }
              label="Attribute"
              {...register(
                `vendorProducts.${formIndex}.pricingRules.${index}.attribute` as const,
                {
                  required: "This field is required",
                }
              )}
            />
          </ObjectListField.Col>

          <ObjectListField.Col>
            <TextField
              label="Value"
              readonly={readonly}
              error={
                errors.vendorProducts?.[formIndex]?.pricingRules?.[index]?.value
                  ?.message
              }
              {...register(
                `vendorProducts.${formIndex}.pricingRules.${index}.value` as const,
                {
                  required: "This field is required",
                }
              )}
            />
          </ObjectListField.Col>

          <ObjectListField.Col>
            <TextField
              readonly={readonly}
              error={
                errors.vendorProducts?.[formIndex]?.pricingRules?.[index]?.price
                  ?.message
              }
              {...register(
                `vendorProducts.${formIndex}.pricingRules.${index}.price` as const,
                {
                  required: "This field is required",
                  valueAsNumber: true,
                }
              )}
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
        {...register(`vendorProducts.${formIndex}.pricingRules`, {
          validate: (value) =>
            value.length > 0 || "At least one pricing rule is required",
        })}
      />
      {errors?.[formIndex]?.pricingRules?.root?.message && (
        <FieldError>
          {errors?.[formIndex]?.pricingRules?.root?.message?.toString()}
        </FieldError>
      )}
    </ObjectListField>
  );
}

export default PricingRulesForm;

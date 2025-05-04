import React from "react";
import ObjectListField from "./ObjectListField";
import TextField from "./TextField";
import { useFieldArray, useFormContext, useFormState } from "react-hook-form";
import { VendorProductFormType } from "@/types";

function PricingRulesForm({
  readonly,
  formIndex,
}: {
  readonly: boolean;
  formIndex: number;
}) {
  const { register } = useFormContext<VendorProductFormType>();
  const {
    fields: pricingFields,
    append: appendPricing,
    remove: removePricing,
  } = useFieldArray({
    name: `vendorProducts.${formIndex}.pricingRules`,
    rules: {
      validate: (value) =>
        value.length > 0 || "At least one pricing rule is required",
    },
  });
  const { errors } = useFormState<VendorProductFormType>({
    name: `vendorProducts.${formIndex}.pricingRules`,
  });

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
          {!readonly && pricingFields.length != 1 && (
            <ObjectListField.Remove handleClick={() => removePricing(index)} />
          )}
        </ObjectListField.Row>
      ))}
    </ObjectListField>
  );
}

export default PricingRulesForm;

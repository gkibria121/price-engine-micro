import React from "react";
import ObjectListField from "./ObjectListField";
import TextField from "./TextField";

import {
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { VendorProductFormType } from "@/types";
function PricingRulesForm({
  readonly,
  formIndex,
}: {
  readonly: boolean;
  formIndex: number;
}) {
  const { register, control } = useFormContext<VendorProductFormType>();
  const {
    fields: pricingFields,
    append: appendPricing,
    remove: removePricing,
  } = useFieldArray({
    control: control,
    name: `vendorProducts.${formIndex}.pricingRules` as const,
  });
  const { errors } = useFormState<VendorProductFormType>({
    name: `vendorProducts.${formIndex}.pricingRules`,
  });
  const lastRuleAttribute = useWatch({
    name: `vendorProducts.${formIndex}.pricingRules.${
      pricingFields.length - 1
    }.attribute`,
  });
  return (
    <ObjectListField
      readonly={readonly}
      defaultItem={{
        attribute: lastRuleAttribute,
        value: "",
        price: 0,
      }}
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
                `vendorProducts.${formIndex}.pricingRules.${index}.attribute` as const
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
                `vendorProducts.${formIndex}.pricingRules.${index}.value` as const
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

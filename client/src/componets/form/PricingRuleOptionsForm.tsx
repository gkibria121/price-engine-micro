import React from "react";
import ObjectListField from "./ObjectListField";

import { useFieldArray, useFormContext, useFormState } from "react-hook-form";
import { VendorProductFormType } from "@/types";
import SelectionField from "./SelectionField";
import CheckBox from "./CheckBox";
import { getPricingRuleOptions } from "@/util/funcitons";
import TextField from "./TextField";
import Button from "../Button";
function PricingRuleOptionsForm({
  readonly,
  formIndex,
}: {
  readonly: boolean;
  formIndex: number;
}) {
  const { register, control, watch, setValue } =
    useFormContext<VendorProductFormType>();
  const { fields: pricingFields } = useFieldArray({
    control: control,
    name: `vendorProducts.${formIndex}.pricingRuleOptions` as const,
  });
  const { errors } = useFormState<VendorProductFormType>({
    name: `vendorProducts.${formIndex}.pricingRuleOptions`,
  });

  const refresh = () => {
    const pricingRules = watch(`vendorProducts.${formIndex}.pricingRules`);
    setValue(
      `vendorProducts.${formIndex}.pricingRuleOptions`,
      getPricingRuleOptions(pricingRules)
    );
  };
  return (
    <ObjectListField
      readonly={readonly}
      defaultItem={{
        values: ["Something"],
        attribute: "Paper Type",
        default: 0,
        inputType: "radio",
        required: true,
        description: "something",
        hasOther: false,
      }}
      label="Pricing Rule Options"
    >
      {" "}
      <div className="flex justify-end">
        <Button type="btnPrimary" buttonType="button" onClick={refresh}>
          Refresh
        </Button>
      </div>
      <ObjectListField.Row className="pb-1">
        <ObjectListField.Col>
          <label htmlFor="">Attribute</label>
        </ObjectListField.Col>
        <ObjectListField.Col>
          <label htmlFor="">Default Value</label>
        </ObjectListField.Col>
        <ObjectListField.Col>
          <label htmlFor="">Options</label>
        </ObjectListField.Col>
      </ObjectListField.Row>
      {pricingFields.map((field, index) => (
        <ObjectListField.Row key={field.id}>
          <ObjectListField.Col>
            <TextField
              readonly={true}
              {...register(
                `vendorProducts.${formIndex}.pricingRuleOptions.${index}.attribute` as const
              )}
            />
          </ObjectListField.Col>
          <ObjectListField.Col>
            <SelectionField
              label="Default"
              showLabel={false}
              error={
                errors.vendorProducts?.[formIndex]?.pricingRuleOptions?.[index]
                  ?.attribute?.message
              }
              options={field.values.map((value, idx) => ({
                value: idx,
                name: value,
              }))}
              {...register(
                `vendorProducts.${formIndex}.pricingRuleOptions.${index}.default` as const,
                {
                  valueAsNumber: true,
                }
              )}
            />
          </ObjectListField.Col>
          <ObjectListField.Col>
            <CheckBox
              label="Required"
              {...register(
                `vendorProducts.${formIndex}.pricingRuleOptions.${index}.required` as const
              )}
            />
            <CheckBox
              label="Has Other"
              {...register(
                `vendorProducts.${formIndex}.pricingRuleOptions.${index}.hasOther` as const
              )}
            />
          </ObjectListField.Col>
        </ObjectListField.Row>
      ))}
    </ObjectListField>
  );
}

export default PricingRuleOptionsForm;

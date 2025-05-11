import React from "react";
import ObjectListField from "./ObjectListField";

import { useFieldArray, useFormContext, useFormState } from "react-hook-form";
import { VendorProductFormType } from "@/types";
import SelectionField from "./SelectionField";
import CheckBox from "./CheckBox";
import { getPricingRuleMetas } from "@/util/funcitons";
import TextField from "./TextField";
import Button from "../Button";
function PricingRuleMetasForm({
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
    name: `vendorProducts.${formIndex}.pricingRuleMetas` as const,
  });
  const { errors } = useFormState<VendorProductFormType>({
    name: `vendorProducts.${formIndex}.pricingRuleMetas`,
  });

  const refresh = () => {
    const pricingRules = watch(`vendorProducts.${formIndex}.pricingRules`);
    setValue(
      `vendorProducts.${formIndex}.pricingRuleMetas`,
      getPricingRuleMetas(pricingRules)
    );
  };
  const inputTypes = ["radio", "text", "checkbox", "textarea"];
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
      label="Pricing Rule Metas"
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
          <label htmlFor="">Description</label>
        </ObjectListField.Col>
        <ObjectListField.Col>
          <label htmlFor="">Input Type</label>
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
                `vendorProducts.${formIndex}.pricingRuleMetas.${index}.attribute` as const
              )}
            />
          </ObjectListField.Col>
          <ObjectListField.Col>
            <SelectionField
              label="Default"
              showLabel={false}
              error={
                errors.vendorProducts?.[formIndex]?.pricingRuleMetas?.[index]
                  ?.attribute?.message
              }
              options={field.values.map((value, idx) => ({
                value: idx,
                name: value,
              }))}
              {...register(
                `vendorProducts.${formIndex}.pricingRuleMetas.${index}.default` as const,
                {
                  valueAsNumber: true,
                }
              )}
            />
          </ObjectListField.Col>
          <ObjectListField.Col>
            <TextField
              label="Description"
              isTextArea={true}
              error={
                errors.vendorProducts?.[formIndex]?.pricingRuleMetas?.[index]
                  ?.description?.message
              }
              {...register(
                `vendorProducts.${formIndex}.pricingRuleMetas.${index}.description` as const
              )}
            />
          </ObjectListField.Col>
          <ObjectListField.Col>
            <SelectionField
              label="Input Type"
              showLabel={false}
              error={
                errors.vendorProducts?.[formIndex]?.pricingRuleMetas?.[index]
                  ?.inputType?.message
              }
              options={inputTypes.map((value) => ({
                value: value,
                name: value,
              }))}
              {...register(
                `vendorProducts.${formIndex}.pricingRuleMetas.${index}.inputType` as const
              )}
            />
          </ObjectListField.Col>
          <ObjectListField.Col>
            <CheckBox
              error={
                errors.vendorProducts?.[formIndex]?.pricingRuleMetas?.[index]
                  ?.required?.message
              }
              label="Required"
              {...register(
                `vendorProducts.${formIndex}.pricingRuleMetas.${index}.required` as const
              )}
            />
            <CheckBox
              error={
                errors.vendorProducts?.[formIndex]?.pricingRuleMetas?.[index]
                  ?.hasOther?.message
              }
              label="Has Other"
              {...register(
                `vendorProducts.${formIndex}.pricingRuleMetas.${index}.hasOther` as const
              )}
            />
          </ObjectListField.Col>
        </ObjectListField.Row>
      ))}
    </ObjectListField>
  );
}

export default PricingRuleMetasForm;

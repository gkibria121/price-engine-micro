import React from "react";
import ObjectListField from "./ObjectListField";
import TextField from "./TextField";
import { useFieldArray, useFormContext, useFormState } from "react-hook-form";
import { VendorProductFormType } from "@/types";
import FieldError from "./FieldError";

function DeliveryRulesForm({
  readonly,
  formIndex,
}: {
  readonly: boolean;
  formIndex: number;
}) {
  const { register } = useFormContext<VendorProductFormType>();
  const {
    fields: deliveryFields,
    append: appendDelivery,
    remove: removeDelivery,
  } = useFieldArray({
    name: `vendorProducts.${formIndex}.deliverySlots`,
    rules: {
      validate: (value) =>
        value.length > 0 || "At least one delivery rule is required",
    },
  });
  const { errors } = useFormState({
    name: `vendorProducts.${formIndex}.deliverySlots`,
  });

  return (
    <ObjectListField
      readonly={readonly}
      defaultItem={{
        label: "",
        price: 0,
        deliveryTimeStartDate: 0,
        deliveryTimeStartTime: "0:0",
        deliveryTimeEndDate: 0,
        deliveryTimeEndTime: "0:0",
        cutoffTime: "0:0",
      }}
      label="Delivery Options"
      append={appendDelivery}
    >
      {errors.vendorProducts?.[formIndex]?.deliverySlots?.root?.message && (
        <FieldError>
          {errors.vendorProducts[formIndex].deliverySlots.root?.message}
        </FieldError>
      )}
      {deliveryFields.map((field, index) => (
        <ObjectListField.Table key={field.id}>
          <ObjectListField.Row>
            <ObjectListField.Col>
              <TextField
                label="Label"
                readonly={readonly}
                error={
                  errors.vendorProducts?.[formIndex]?.deliverySlots?.[index]
                    ?.label?.message
                }
                {...register(
                  `vendorProducts.${formIndex}.deliverySlots.${index}.label` as const
                )}
              />
            </ObjectListField.Col>
            {!readonly && deliveryFields.length > 1 && (
              <ObjectListField.Remove
                handleClick={() => removeDelivery(index)}
              />
            )}
          </ObjectListField.Row>
          <ObjectListField.Row>
            <ObjectListField.Col>
              <TextField
                label="Start Date (0-10)"
                type="number"
                min="0"
                max="10"
                readonly={readonly}
                error={
                  errors.vendorProducts?.[formIndex]?.deliverySlots?.[index]
                    ?.deliveryTimeStartDate?.message
                }
                {...register(
                  `vendorProducts.${formIndex}.deliverySlots.${index}.deliveryTimeStartDate` as const,
                  {
                    valueAsNumber: true,
                  }
                )}
              />
            </ObjectListField.Col>
            <ObjectListField.Col>
              <TextField
                label="Start Time"
                type="time"
                readonly={readonly}
                error={
                  errors.vendorProducts?.[formIndex]?.deliverySlots?.[index]
                    ?.deliveryTimeStartTime?.message
                }
                {...register(
                  `vendorProducts.${formIndex}.deliverySlots.${index}.deliveryTimeStartTime` as const
                )}
              />
            </ObjectListField.Col>
            <ObjectListField.Col>
              <TextField
                label="End Date (0-30)"
                type="number"
                min="0"
                max="30"
                readonly={readonly}
                error={
                  errors.vendorProducts?.[formIndex]?.deliverySlots?.[index]
                    ?.deliveryTimeEndDate?.message
                }
                {...register(
                  `vendorProducts.${formIndex}.deliverySlots.${index}.deliveryTimeEndDate` as const,
                  {
                    valueAsNumber: true,
                  }
                )}
              />
            </ObjectListField.Col>
            <ObjectListField.Col>
              <TextField
                label="End Time"
                type="time"
                readonly={readonly}
                error={
                  errors.vendorProducts?.[formIndex]?.deliverySlots?.[index]
                    ?.deliveryTimeEndTime?.message
                }
                {...register(
                  `vendorProducts.${formIndex}.deliverySlots.${index}.deliveryTimeEndTime` as const
                )}
              />
            </ObjectListField.Col>
            <ObjectListField.Col>
              <TextField
                label="Cutoff Time"
                type="time"
                readonly={readonly}
                error={
                  errors.vendorProducts?.[formIndex]?.deliverySlots?.[index]
                    ?.cutoffTime?.message
                }
                {...register(
                  `vendorProducts.${formIndex}.deliverySlots.${index}.cutoffTime` as const
                )}
              />
            </ObjectListField.Col>
            <ObjectListField.Col>
              <TextField
                label="Price"
                type="number"
                readonly={readonly}
                error={
                  errors.vendorProducts?.[formIndex]?.deliverySlots?.[index]
                    ?.price?.message
                }
                {...register(
                  `vendorProducts.${formIndex}.deliverySlots.${index}.price` as const,
                  {
                    valueAsNumber: true,
                  }
                )}
              />
            </ObjectListField.Col>
          </ObjectListField.Row>
        </ObjectListField.Table>
      ))}
    </ObjectListField>
  );
}

export default DeliveryRulesForm;

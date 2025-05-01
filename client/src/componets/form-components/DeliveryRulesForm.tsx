import React from "react";
import ObjectListField from "./ObjectListField";
import TextField from "./TextField";
import { useFieldArray, useFormContext } from "react-hook-form";
import FieldError from "./FieldError";

function DeliveryRulesForm({ readonly }: { readonly: boolean }) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const {
    fields: deliveryFields,
    append: appendDelivery,
    remove: removeDelivery,
  } = useFieldArray({ control, name: "deliverySlots" });
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
      {deliveryFields.map((field, index) => (
        <ObjectListField.Table key={field.id}>
          <ObjectListField.Row>
            <ObjectListField.Col>
              <TextField
                label="Label"
                readonly={readonly}
                error={errors.deliverySlots?.[index]?.label?.message}
                {...register(`deliverySlots.${index}.label` as const, {
                  required: "This field is required",
                })}
              />
            </ObjectListField.Col>
            <ObjectListField.Col>
              <TextField
                label="Price"
                type="number"
                readonly={readonly}
                error={errors.deliverySlots?.[index]?.price?.message}
                {...register(`deliverySlots.${index}.price` as const, {
                  required: "This field is required",
                })}
              />
            </ObjectListField.Col>
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
                  errors.deliverySlots?.[index]?.deliveryTimeStartDate?.message
                }
                {...register(
                  `deliverySlots.${index}.deliveryTimeStartDate` as const,
                  {
                    required: "This field is required",
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
                  errors.deliverySlots?.[index]?.deliveryTimeStartTime?.message
                }
                {...register(
                  `deliverySlots.${index}.deliveryTimeStartTime` as const,
                  {
                    required: "This field is required",
                  }
                )}
              />
            </ObjectListField.Col>
          </ObjectListField.Row>
          <ObjectListField.Row>
            <ObjectListField.Col>
              <TextField
                label="End Date (0-30)"
                type="number"
                min="0"
                max="30"
                readonly={readonly}
                error={
                  errors.deliverySlots?.[index]?.deliveryTimeEndDate?.message
                }
                {...register(
                  `deliverySlots.${index}.deliveryTimeEndDate` as const,
                  {
                    required: "This field is required",
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
                  errors.deliverySlots?.[index]?.deliveryTimeEndTime?.message
                }
                {...register(
                  `deliverySlots.${index}.deliveryTimeEndTime` as const,
                  {
                    required: "This field is required",
                  }
                )}
              />
            </ObjectListField.Col>
          </ObjectListField.Row>
          <ObjectListField.Row>
            <ObjectListField.Col>
              <TextField
                label="Cutoff Time"
                type="time"
                readonly={readonly}
                error={errors.deliverySlots?.[index]?.cutoffTime?.message}
                {...register(`deliverySlots.${index}.cutoffTime` as const, {
                  required: "This field is required",
                })}
              />
            </ObjectListField.Col>
          </ObjectListField.Row>
          {!readonly && (
            <ObjectListField.Remove handleClick={() => removeDelivery(index)} />
          )}
        </ObjectListField.Table>
      ))}
      <input
        type="hidden"
        {...register("deliverySlots", {
          validate: (value) =>
            value.length > 0 || "At least one delivery rule is required",
        })}
      />
      {errors.deliverySlots?.root?.message && (
        <FieldError>
          {errors.deliverySlots?.root?.message?.toString()}
        </FieldError>
      )}
    </ObjectListField>
  );
}

export default DeliveryRulesForm;

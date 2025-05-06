import { z } from "zod";

export const ProductSelectionSchema = z.object({
  product: z.string().min(1, "Please select a product"),
  quantity: z.number().min(1, "Quantity must be at least 1."),
  pricingRules: z
    .array(
      z.object({
        attribute: z.string(),
        value: z.string(),
        otherValue: z.string().optional(),
      })
    )
    .min(1, "Please select one attribute"),
});

export const DeliverySelectionSchema = z.object({
  deliveryMethod: z.object({
    label: z.string(),
  }),
});

export const ProductOrderFlowFormSchema = ProductSelectionSchema.merge(
  DeliverySelectionSchema
);

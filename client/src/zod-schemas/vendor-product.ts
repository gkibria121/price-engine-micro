import { string, z } from "zod";
import { productSchema } from "./product";
import { vendorSchema } from "./vendor";
export const deliverySlotSchem = z.object({
  label: z.string(),
  price: z.number(),
  deliveryTimeStartDate: z.number(),
  deliveryTimeStartTime: z.string().regex(/^\d{1,2}:\d{2}$/, {
    message: "Invalid time format (expected HH:MM)",
  }),
  deliveryTimeEndDate: z.number(),
  deliveryTimeEndTime: z.string().regex(/^\d{1,2}:\d{2}$/, {
    message: "Invalid time format (expected HH:MM)",
  }),
  cutoffTime: z.string().regex(/^\d{1,2}:\d{2}$/, {
    message: "Invalid time format (expected HH:MM)",
  }),
});
export const quantityPricingSchema = z.object({
  quantity: z.number(),
  price: z.number(),
});
export const pricingRuleSchema = z.object({
  attribute: z.string(),
  value: z.string(),
  price: z.union([z.string(), z.number()]),
});
export const vendorProductSchema = z.object({
  product: productSchema,
  vendor: vendorSchema,
  id: string(),
  pricingRules: z.array(pricingRuleSchema),
  deliverySlots: z.array(deliverySlotSchem),
  quantityPricings: z.array(quantityPricingSchema),
});

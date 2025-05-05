import { z } from "zod";
import { productSchema } from "./product";
import { vendorSchema } from "./vendor";

// Delivery Slot Schema with validation messages
export const deliverySlotSchem = z.object({
  label: z.string().nonempty("Label is required"), // Custom error message for label field
  price: z.number().min(0, "Price must be a positive number"), // Custom error message for price
  deliveryTimeStartDate: z.number().min(1, "Invalid start date"), // Custom error message for date
  deliveryTimeStartTime: z.string().regex(/^\d{1,2}:\d{2}$/, {
    message: "Invalid time format (expected HH:MM)",
  }), // Custom error message for time format
  deliveryTimeEndDate: z.number().min(1, "Invalid end date"), // Custom error message for date
  deliveryTimeEndTime: z.string().regex(/^\d{1,2}:\d{2}$/, {
    message: "Invalid time format (expected HH:MM)",
  }), // Custom error message for time format
  cutoffTime: z.string().regex(/^\d{1,2}:\d{2}$/, {
    message: "Invalid time format (expected HH:MM)",
  }), // Custom error message for cutoff time
});

// Quantity Pricing Schema with validation messages
export const quantityPricingSchema = z.object({
  quantity: z.number().min(1, "Quantity must be greater than 0"), // Custom message for quantity
  price: z.number().min(0, "Price must be a positive number"), // Custom message for price
});

// Pricing Rule Schema with validation messages
export const pricingRuleSchema = z.object({
  attribute: z.string().nonempty("Attribute is required"), // Custom message for attribute
  value: z.string().nonempty("Value is required"), // Custom message for value
  price: z.union([z.string().nonempty("Price is required"), z.number()]), // Custom message for price
});

// Vendor Product Schema with validation messages
export const vendorProductSchema = z.object({
  product: productSchema,
  vendor: vendorSchema,
  id: z.string().nonempty("ID is required"),

  pricingRules: z
    .array(pricingRuleSchema)
    .min(1, { message: "At least one pricing rule is required" }),

  deliverySlots: z
    .array(deliverySlotSchem)
    .min(1, { message: "At least one delivery slot is required" }),

  quantityPricings: z
    .array(quantityPricingSchema)
    .min(1, { message: "At least one quantity pricing is required" }),
});
// Vendor Product Form Schema with validation messages
export const VendorProductFormSchema = z.object({
  vendorProducts: z.array(
    vendorProductSchema.omit({ product: true, vendor: true, id: true }).extend({
      productId: z
        .string()
        .nonempty("Product ID is required") // Custom message for productId
        .min(1, "Product ID cannot be empty"), // Custom message for productId

      vendorId: z
        .string()
        .nonempty("Vendor ID is required") // Custom message for vendorId
        .min(1, "Vendor ID cannot be empty"), // Custom message for vendorId
    })
  ),
});

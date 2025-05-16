import { ProductOrderFlowFormSchema } from "@/schemas/zod-schema";
import { pricingRuleMetaSchema, productSchema } from "@daynightprint/shared";
import { vendorFormSchema, vendorSchema } from "@daynightprint/shared";
import {
  deliverySlotSchem,
  pricingRuleSchema,
  quantityPricingSchema,
  VendorProductFormSchema,
} from "@daynightprint/shared";
import { z } from "zod";

// Product types
export type PricingRule = z.infer<typeof pricingRuleSchema>;

export type DeliveryRule = z.infer<typeof deliverySlotSchem>;

export type QuantityPricing = z.infer<typeof quantityPricingSchema>;
export type PricingRuleMeta = z.infer<typeof pricingRuleMetaSchema>;

export type Product = z.infer<typeof productSchema>;
export interface VendorProduct {
  id: string;
  product: Product;
  pricingRules: PricingRule[];
  deliverySlots: DeliverySlot[];
  quantityPricings: QuantityPricing[];
  pricingRuleMetas: PricingRuleMeta[];
  rating: number;
  vendor: Vendor;
}

// Vendor types
export type Vendor = z.infer<typeof vendorSchema>;
export type ValidationErrors = Record<string, string[]>;
export const vendorProductSchema = z.object({
  product: productSchema,
  vendor: vendorSchema,
  id: z.string().nonempty("ID is required"),

  pricingRules: z
    .array(pricingRuleSchema)
    .min(1, { message: "At least one pricing rule is required" }),

  deliverySlots: z
    .array(deliverySlotSchem)
    .min(1, { message: "At least one delivery slot is required" })
    .superRefine((options, ctx) => {
      const labelMap = new Map<string, number[]>();

      options.forEach((option, index) => {
        const existing = labelMap.get(option.label) || [];
        existing.push(index);
        labelMap.set(option.label, existing);
      });

      for (const [, indices] of labelMap.entries()) {
        if (indices.length > 1) {
          indices.forEach((index) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Each label must be unique",
              path: [`${index}`, "label"], // or ["label"] if you're using a nested schema
            });
          });
        }
      }
    }),
  quantityPricings: z
    .array(quantityPricingSchema)
    .min(1, { message: "At least one quantity pricing is required" }),
  pricingRuleMetas: z
    .array(pricingRuleMetaSchema)
    .min(1, { message: "At least one pricing rule meta is required" })
    .refine(
      (options) => {
        const attributes = options.map((o) => o.attribute);
        return new Set(attributes).size === attributes.length;
      },
      {
        message: "Each options must be unique",
        path: [], // applies to the array as a whole
      }
    ),
  rating: z
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .min(0, "Rating must be at least 0")
    .max(100, "Rating cannot exceed 100"),
});
export type VendorProductFormType = z.infer<typeof VendorProductFormSchema>;

export type DeliverySlot = z.infer<typeof deliverySlotSchem>;
export type PageProps = {
  params: Promise<{ id: string }>;
};
export type VendorFormType = z.infer<typeof vendorFormSchema>;

export type PricingRuleSelectionType = {
  values: [string, ...string[]];
  attribute: string;
  default: number;
  inputType: string;
  required?: boolean;
  description?: string;
  hasOther?: boolean;
};

export type ProductOrderFlowFormType = z.infer<
  typeof ProductOrderFlowFormSchema
>;

export type PriceCalculationResultType = {
  productName: string;
  quantity: number;
  totalPrice?: number;
  breakdown?: {
    basePrice: number;
    attributeCost: number;
    deliveryCharge: number;
  };
};

export type PriceCalculationRequest = {
  productId: string;
  vendorId: string;
  quantity: number;
  attributes: { name: string; value: string }[];
  deliveryMethod: {
    label: string;
  };
};
type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends Primitive
    ? `${K}`
    : T[K] extends Array<infer U>
    ? U extends Primitive
      ? `${K}` | `${K}.${number}`
      : `${K}` | `${K}.${number}` | `${K}.${number}.${NestedKeyOf<U>}`
    : T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`;
}[keyof T & string];

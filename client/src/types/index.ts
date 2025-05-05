import { ProductOrderFlowFormSchema } from "@/schemas/zod-schema";
import { productSchema } from "@daynightprint/shared";
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

export type Product = z.infer<typeof productSchema>;
export interface VendorProduct {
  id: string;
  product: Product;
  pricingRules: PricingRule[];
  deliverySlots: DeliverySlot[];
  quantityPricings: QuantityPricing[];
  vendor: Vendor;
}

// Vendor types
export type Vendor = z.infer<typeof vendorSchema>;
export type ValidationErrors = Record<string, string[]>;
export type VendorProductFormType = z.infer<typeof VendorProductFormSchema>;

export type DeliverySlot = z.infer<typeof deliverySlotSchem>;
export type PageProps = {
  params: Promise<{ id: string }>;
};
export type VendorFormType = z.infer<typeof vendorFormSchema>;

export type PricingRuleSelectionType = {
  attribute: string;
  default: number;
  values: string[];
  inputType: HTMLInputElement["type"];
  required: boolean;
  description: string;
  hasOther: boolean;
};

export type ProductOrderFlowFormType = z.infer<
  typeof ProductOrderFlowFormSchema
>;

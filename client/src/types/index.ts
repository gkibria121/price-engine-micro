import { productSchema } from "@/zod-schemas/product";
import { vendorFormSchema, vendorSchema } from "@/zod-schemas/vendor";
import {
  deliverySlotSchem,
  pricingRuleSchema,
  quantityPricingSchema,
  VendorProductFormSchema,
} from "@/zod-schemas/vendor-product";
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

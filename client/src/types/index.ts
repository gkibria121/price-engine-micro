// Product types
export interface PricingRule {
  attribute: string;
  value: string;
  price: number;
}

export interface DeliveryRule {
  method: string;
  price: number;
}

export interface QuantityPricing {
  minQty: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
}
export interface VendorProduct {
  id: string;
  product: Product;
  pricingRules: PricingRule[];
  deliverySlots: DeliveryRule[];
  quantityPricings: QuantityPricing[];
  vendor: Vendor;
}

// Vendor types
export interface Vendor {
  id: string;
  name: string;
  email: string;
  address: string;
  rating: number;
}
export type ValidationErrors = Record<string, string[]>;
export type VendorProductFormType = {
  productId: string;
  vendorId: string;
  pricingRules: { attribute: string; value: string; price: number }[];
  deliverySlots: {
    label: string;
    price: number;
    deliveryTimeStartDate: number;
    deliveryTimeStartTime: `${number}:${number}`;
    deliveryTimeEndDate: number;
    deliveryTimeEndTime: `${number}:${number}`;
    cutoffTime: `${number}:${number}`;
  }[];
  quantityPricings: { quantity: number; price: number }[];
};

export type DeliverySlot = {
  label: string;
  price: number;
  deliveryTimeStartDate: number;
  deliveryTimeStartTime: `${number}:${number}`;
  deliveryTimeEndDate: number;
  deliveryTimeEndTime: `${number}:${number}`;
  cutoffTime: `${number}:${number}`;
};

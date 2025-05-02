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
  quantity: number;
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
  deliverySlots: DeliverySlot[];
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
  vendor: Vendor;
  product: Product;
}
export type ValidationErrors = Record<string, string[]>;
export type VendorProductFormType = {
  vendorProducts: {
    productId: string;
    vendorId: string;
    pricingRules: { attribute: string; value: string; price: number }[];
    deliverySlots: DeliverySlot[];
    quantityPricings: QuantityPricing[];
  }[];
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

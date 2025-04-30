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
  _id?: string;
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

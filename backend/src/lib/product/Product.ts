import DeliveryRule from "./DeliveryRule";
import PricingRule from "./PricingRule";
import QuantityPricing from "./QuantityPricing";

// Models
export default class Product {
  name: string;
  pricingRules: PricingRule[];
  deliveryRules: DeliveryRule[];
  quantityPricings: QuantityPricing[];

  constructor(
    name: string,
    pricingRules: PricingRule[] = [],
    deliveryRules: DeliveryRule[] = [],
    quantityPricings: QuantityPricing[] = []
  ) {
    this.name = name;
    this.pricingRules = pricingRules;
    this.deliveryRules = deliveryRules;
    this.quantityPricings = quantityPricings;
  }
}

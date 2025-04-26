import PriceCalculationRequest from "./PriceCalculationRequest";
import DeliveryRule from "./product/DeliveryRule";
import PricingRule from "./product/PricingRule";
import Product from "./product/Product";
import QuadraticCurveFitter from "./QuadraticCurveFitter";

// Pricing Engine
export default class PricingEngine {
  curveFitter: QuadraticCurveFitter;
  pricingRules: PricingRule[];
  deliveryRules: DeliveryRule[];

  constructor(product: Product) {
    this.curveFitter = new QuadraticCurveFitter();
    this.pricingRules = product.pricingRules;
    this.deliveryRules = product.deliveryRules;
    this.curveFitter.fit(product.quantityPricing);
  }

  calculatePrice(request: PriceCalculationRequest): Record<string, unknown> {
    const basePrice = this.curveFitter.predict(request.quantity);
    let total = basePrice;

    request.selectedAttributes.forEach((attribute) => {
      const rule = this.pricingRules.find(
        (r) =>
          r.attributeName === attribute.name &&
          r.attributeValue === attribute.value
      );
      if (rule) {
        total += total * (rule.percentageChange / 100);
      }
    });

    const attributeCost = total - basePrice;

    const deliveryRule = this.deliveryRules.find(
      (r) =>
        r.deliveryNature.toLowerCase() === request.deliveryMethod.toLowerCase()
    );

    if (!deliveryRule) {
      throw new Error("Invalid delivery nature");
    }

    total += deliveryRule.deliveryFee;
    const deliveryCharge = deliveryRule.deliveryFee;
    return {
      totalPrice: total,
      breakdown: { basePrice: basePrice, attributeCost, deliveryCharge },
    };
  }
}

import { NotFoundException } from "../Exceptions/NotFoundException";
import { PriceEngineException } from "../Exceptions/PriceEngineException";
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

  calculatePrice(request: PriceCalculationRequest): {
    totalPrice: number;
    breakdown: {
      basePrice: number;
      attributeCost: number;
      deliveryCharge: number;
    };
  } {
    if (request.quantity <= 0)
      return {
        totalPrice: 0,
        breakdown: { basePrice: 0, attributeCost: 0, deliveryCharge: 0 },
      };
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
      } else {
        throw new PriceEngineException(
          `Unable to calculate price. Attribute "${attribute.name}" or Attribute value "${attribute.value}" does not exist for this product.`
        );
      }
    });

    const attributeCost = total - basePrice;

    const deliveryRule = this.deliveryRules.find(
      (r) =>
        r.deliveryNature.toLowerCase() === request.deliveryMethod.toLowerCase()
    );

    if (!deliveryRule) {
      throw new PriceEngineException("Invalid delivery nature");
    }

    total += deliveryRule.deliveryFee;
    const deliveryCharge = deliveryRule.deliveryFee;
    return {
      totalPrice: total,
      breakdown: { basePrice: basePrice, attributeCost, deliveryCharge },
    };
  }
}

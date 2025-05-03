import { NotFoundException } from "../Exceptions/NotFoundException";
import { PriceEngineException } from "../Exceptions/PriceEngineException";
import PriceCalculationRequest from "./PriceCalculationRequest";
import DeliveryRule from "./product/DeliveryRule";
import PricingRule from "./product/PricingRule";
import Product from "./product/Product";
import QuantityPricing from "./product/QuantityPricing";
import QuadraticCurveFitter from "./QuadraticCurveFitter";

// Pricing Engine
export default class PricingEngine {
  curveFitter: QuadraticCurveFitter;
  pricingRules: PricingRule[];
  deliveryRules: DeliveryRule[];
  quantityPricings: QuantityPricing[];

  constructor(product: Product) {
    this.curveFitter = new QuadraticCurveFitter();
    this.pricingRules = product.pricingRules;
    this.deliveryRules = product.deliveryRules;
    this.quantityPricings = product.quantityPricings;
    this.curveFitter.fit(product.quantityPricings);
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

    const minQty = this.quantityPricings.reduce(
      (acc, curr) => Math.min(acc, curr.quantity),
      Infinity
    );
    const maxQty = this.quantityPricings.reduce(
      (acc, curr) => Math.max(acc, curr.quantity),
      0
    );
    if (request.quantity > maxQty || request.quantity < minQty) {
      throw new PriceEngineException(
        "Request quantity out of Quanity pricing range"
      );
    }

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

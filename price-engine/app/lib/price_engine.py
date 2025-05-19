from typing import List, Dict, Any
from .product import ( 
    PricingRule,
    DeliveryRule,
    QuantityPricing, 
    Product
)  
from .price_calculation_request import PriceCalculationRequest
from .quadratic_curve_fitter import QuadraticCurveFitter
from ..exceptions.PriceEngineException import PriceEngineException
class PricingEngine:
    def __init__(self, product:Product  ):
        self.curve_fitter = QuadraticCurveFitter()
        self.pricing_rules: List[PricingRule] = product.pricing_rules
        self.delivery_rules: List[DeliveryRule] = product.delivery_rules
        self.quantity_pricings: List[QuantityPricing] = product.quantity_pricings
        self.curve_fitter.fit(product.quantity_pricings)

    def calculate_price(self, request: PriceCalculationRequest) -> Dict[str, Any]:
        if request.quantity <= 0:
            return {
                "totalPrice": 0,
                "breakdown": {"basePrice": 0, "attributeCost": 0, "deliveryCharge": 0},
            }

        min_qty = min(qp.quantity for qp in self.quantity_pricings)
        max_qty = max(qp.quantity for qp in self.quantity_pricings)

        if request.quantity < min_qty or request.quantity > max_qty:
            raise PriceEngineException("Request quantity out of Quantity pricing range")

        base_price = self.curve_fitter.predict(request.quantity)
        total = base_price
       
        for attribute in request.selectedAttributes: 
            rule = next(
                (r for r in self.pricing_rules
                 if r.attribute_name == attribute.name and r.attribute_value == attribute.value),
                None,
            )
            if rule:
                total += total * (rule.percentage_change / 100)
            else:
                raise PriceEngineException(
                    f'Unable to calculate price. Attribute "{attribute.name}" or value "{attribute.value}" does not exist for this product.'
                )

        attribute_cost = total - base_price

        delivery_rule = next(
            (r for r in self.delivery_rules if r.delivery_nature.lower() == request.deliveryMethod.lower()),
            None,
        )

        if not delivery_rule:
            raise PriceEngineException("Invalid delivery nature")

        total += delivery_rule.delivery_fee
        delivery_charge = delivery_rule.delivery_fee

        return {
            "totalPrice": total,
            "breakdown": {
                "basePrice": base_price,
                "attributeCost": attribute_cost,
                "deliveryCharge": delivery_charge,
            },
        }

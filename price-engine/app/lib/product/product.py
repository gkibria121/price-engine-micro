from dataclasses import dataclass, field
from typing import List
from .pricing_rule import PricingRule
from .delivery_rule import DeliveryRule
from .quantity_pricing import QuantityPricing

@dataclass
class Product:
    name: str
    pricing_rules: List[PricingRule] = field(default_factory=list)
    delivery_rules: List[DeliveryRule] = field(default_factory=list)
    quantity_pricings: List[QuantityPricing] = field(default_factory=list)

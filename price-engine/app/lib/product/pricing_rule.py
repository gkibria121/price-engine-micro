from dataclasses import dataclass

@dataclass
class PricingRule:
    attribute_name: str
    attribute_value: str
    percentage_change: float

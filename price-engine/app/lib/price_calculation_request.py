from typing import List
from dataclasses import dataclass
from .product.attribute import Attribute  # Assuming Attribute is in attribute.py or adjust the import path

@dataclass
class PriceCalculationRequest:
    productName: str
    quantity: float
    selectedAttributes: List[Attribute]
    deliveryMethod: str

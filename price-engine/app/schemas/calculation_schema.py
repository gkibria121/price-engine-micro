# schemas/calculation_schema.py
from pydantic import BaseModel, Field
from typing import List, Dict

class Attribute(BaseModel):
    name: str = Field(..., description="Name of the attribute")
    value: str = Field(..., description="Value of the attribute")

class DeliveryMethod(BaseModel):
    label: str = Field(..., description="Delivery method label")

class CalculationRequest(BaseModel):
    productId: str = Field(..., min_length=24, max_length=24)
    vendorId: str = Field(..., min_length=24, max_length=24)
    quantity: float
    attributes: List[Attribute]
    deliveryMethod: DeliveryMethod

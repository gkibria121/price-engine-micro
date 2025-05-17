from pydantic import BaseModel, Field, field_validator
from typing import List

class Attribute(BaseModel):
    name: str = Field(..., description="Name of the attribute")
    value: str = Field(..., description="Value of the attribute")

    @field_validator("name", "value")
    def must_be_non_empty_string(cls, v, field): 
        if not v or not isinstance(v, str):
            raise ValueError(f"This field must be a non-empty string")
        return v


class DeliveryMethod(BaseModel):
    label: str = Field(..., description="Delivery method label")

    @field_validator("label")
    def label_must_be_non_empty(cls, v):
        if not v or not isinstance(v, str):
            raise ValueError("deliveryMethod.label is required and must be a string")
        return v


class CalculationRequest(BaseModel):
    productId: str = Field(..., min_length=24, max_length=24, description="Must be a valid 24-character MongoID")
    vendorId: str = Field(..., min_length=24, max_length=24, description="Must be a valid 24-character MongoID")
    quantity: float = Field(..., gt=0, description="Quantity must be a number")
    attributes: List[Attribute] = Field(..., min_items=1, description="Must be a non-empty list of attributes")
    deliveryMethod: DeliveryMethod
 

    @field_validator("quantity")
    def validate_quantity(cls, v):
        if v is None or not isinstance(v, (int, float)):
            raise ValueError("quantity is required and must be a number")
        return v

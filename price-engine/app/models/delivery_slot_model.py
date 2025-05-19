from odmantic import  EmbeddedModel,Field
from pydantic import field_validator
from .validations import validate_time
import re
class DeliverySlot(EmbeddedModel):
    label: str
    price: float
    deliveryTimeStartDate: int = Field(gt=-1)
    deliveryTimeStartTime: str = Field(...)
    deliveryTimeEndDate: int = Field(gt=-1)
    deliveryTimeEndTime: str = Field(...)
    cutoffTime: str = Field(...)
    @field_validator("deliveryTimeStartTime")
    def validate_time_format(cls, v):
        if not re.match(r"^\d{1,2}:\d{2}$", v):
            raise ValueError(f"{v} is not a valid time format (HH:MM)!")
        return v
    @field_validator("deliveryTimeEndTime")
    def validate_time_format(cls, v):
        if not re.match(r"^\d{1,2}:\d{2}$", v):
            raise ValueError(f"{v} is not a valid time format (HH:MM)!")
        return v
    @field_validator("cutoffTime")
    def validate_time_format(cls, v):
        if not re.match(r"^\d{1,2}:\d{2}$", v):
            raise ValueError(f"{v} is not a valid time format (HH:MM)!")
        return v
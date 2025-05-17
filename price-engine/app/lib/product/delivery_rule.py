from dataclasses import dataclass

@dataclass
class DeliveryRule:
    delivery_nature: str
    delivery_fee: float

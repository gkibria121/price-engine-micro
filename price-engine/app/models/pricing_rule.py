from odmantic import  EmbeddedModel
class PricingRule(EmbeddedModel):
    attribute: str
    value: str
    price: float
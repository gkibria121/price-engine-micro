from odmantic import  EmbeddedModel
class QuantityPricing(EmbeddedModel):
 
    quantity: int
    price: float

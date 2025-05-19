from odmantic import Model  
from typing import List 
from .product_model import Product
from .vendor_model import Vendor
from .pricing_rule import PricingRule
from .delivery_slot_model import DeliverySlot
from .quantity_pricing_model import QuantityPricing
 
class VendorProduct(Model):
 
    vendor: Vendor
    product: Product
    rating: float
    pricingRules: List[PricingRule] = []
    deliverySlots: List[DeliverySlot] = []
    quantityPricings: List[QuantityPricing] = [] 

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from fastapi.requests import Request  # Note: Usually FastAPI passes the body as parameters, but you can access Request for raw body if needed
from app.db import engine
from app.lib.product import Product, PricingRule, DeliveryRule, QuantityPricing, Attribute
from app.lib import PricingEngine, PriceCalculationRequest
from app.models import VendorProduct,Product
from app.exceptions.NotFoundException import NotFoundException
from bson import ObjectId

api_router = APIRouter()

@api_router.post('/calculate-price')
async def calculate_price(data: dict):
    product_id = data.get('productId')
    vendor_id = data.get('vendorId')
    quantity = data.get('quantity')
    attributes = data.get('attributes', [])
    delivery_method = data.get('deliveryMethod')

    if not (product_id and vendor_id):
        return JSONResponse(status_code=400, content={"error": "productId and vendorId are required"})

    vendor_product = await engine.find_one(
        VendorProduct,
        {
            "product.id": ObjectId(product_id),
            "vendor.id": ObjectId(vendor_id)
        }
    )
    if not vendor_product:
        raise HTTPException(status_code=404, detail="VendorProduct not found!")

    matched_delivery = next(
        (slot for slot in vendor_product.deliverySlots if slot.label == delivery_method.get('label')),
        None
    )
    if not matched_delivery:
        raise HTTPException(status_code=404, detail="Delivery method not found!")

    product = Product(
        vendor_product.product.name,
        [PricingRule(rule.attribute, rule.value, rule.price) for rule in vendor_product.pricingRules],
        [DeliveryRule(slot.label, slot.price) for slot in vendor_product.deliverySlots],
        [QuantityPricing(qp.quantity, qp.price) for qp in vendor_product.quantityPricings],
    )

    pricing_engine = PricingEngine(product)

    price_request = PriceCalculationRequest(
        vendor_product.product.name,
        quantity,
        [Attribute(attr['name'], attr['value']) for attr in attributes],
        delivery_method['label']
    )

    price_data = pricing_engine.calculate_price(price_request)

    response = {
        "productName": vendor_product.product.name,
        "quantity": quantity,
        **price_data
    }

    return response


@api_router.get('/test')
async def test():
    # from app.models import VendorProduct
    # from app.models.vendor_model import Vendor
    # from app.models.product_model import Product
    # from app.models.pricing_rule import PricingRule
    # from app.models.quantity_pricing_model import QuantityPricing
    # from app.models.delivery_slot_model import DeliverySlot

    # # Create embedded subdocuments
    # vendor = Vendor(name="Acme Vendor", address="42 Vendor St",email="gkibria121@gmail.com")
    # product = Product(name="Gadget X" )

    # pricing_rules = [PricingRule(attribute="Color", value="Red", price=100)]
    # quantity_pricings = [
    #     QuantityPricing(quantity=10, price=1000),
    #     QuantityPricing(quantity=20, price=2000)
    # ]
    # delivery_slots = [ DeliverySlot(
    #                 label="express",
    #                 price=50.0,
    #                 deliveryTimeStartDate=0,
    #                 deliveryTimeStartTime="09:30",
    #                 deliveryTimeEndDate=0,
    #                 deliveryTimeEndTime="18:00",
    #                 cutoffTime="17:00"
    #                 )]

    # # Create VendorProduct (top-level ODMantic Model)
    # vendor_product = VendorProduct(
    #     vendor=vendor,
    #     product=product,
    #     rating=4.5,
    #     pricingRules=pricing_rules,
    #     quantityPricings=quantity_pricings,
    #     deliverySlots=delivery_slots
    # )

    # # Save to DB
    # await engine.save(vendor_product)

    # Retrieve and return
    return await engine.find(VendorProduct)

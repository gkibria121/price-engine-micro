from flask import Blueprint, jsonify, request 
from app.db import mongo
from .validators import validate_calculation_request
from app.lib.product import Product,PricingRule,DeliveryRule,QuantityPricing,Attribute
from app.lib import PricingEngine,PriceCalculationRequest
from app.exceptions.NotFoundException import NotFoundException
from bson import ObjectId
api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/calculate-price', methods=['POST'])
def calculate_price():
    data, error_response, status = validate_calculation_request()
    if error_response:
        return error_response, status

    product_id = data.get('productId')
    vendor_id = data.get('vendorId')
    quantity = data.get('quantity')
    attributes = data.get('attributes', [])
    delivery_method = data.get('deliveryMethod') 
  
    vendor_product = mongo.db.vendor_products.find_one({
        "product": ObjectId(product_id),
        "vendor": ObjectId(vendor_id)
    }) 
    if not vendor_product:
        raise NotFoundException("VendorProduct not found!")

    # Assuming deliverySlots is a list of dicts
    matched_delivery = next(
        (slot for slot in vendor_product.get('deliverySlots', [])
         if slot.get('label') == delivery_method.get('label')),
        None
    )
    if not matched_delivery:
        raise NotFoundException("Delivery method not found!") 
    
    product_data = mongo.db.products.find_one({"_id": ObjectId(product_id)})
    if not product_data:
        raise NotFoundException("Product not found!")

    # Build product object and pricing rules similar to your JS classes
    # Assuming you have similar Python classes: Product, PricingRule, DeliveryRule, QuantityPricing, PricingEngine, PriceCalculationRequest, Attribute

    product = Product(
        product_data['name'],
        [PricingRule(rule['attribute'], rule['value'], rule['price']) for rule in vendor_product.get('pricingRules', [])],
        [DeliveryRule(slot['label'], slot['price']) for slot in vendor_product.get('deliverySlots', [])],
        [QuantityPricing(qp['quantity'], qp['price']) for qp in vendor_product.get('quantityPricings', [])],
    )

    pricing_engine = PricingEngine(product)

    price_request = PriceCalculationRequest(
        product_data['name'],
        quantity,
        [Attribute(attr['name'], attr['value']) for attr in attributes],
        delivery_method['label']
    )

    price_data = pricing_engine.calculate_price(price_request)

    response = {
        "productName": product_data['name'],
        "quantity": quantity,
        **price_data
    }
    return jsonify(response)

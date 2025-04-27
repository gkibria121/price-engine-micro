import { Request, Response } from "express";
import { getMatchedDeliverySlot, getVendor } from "../services/vendorService";
import { NotFoundException } from "../Exceptions/NotFoundException";
import VendorProductModel from "../models/VendorProductModel";
import ProductModel from "../models/ProductModel";
import Product from "../lib/product/Product";
import PricingRule from "../lib/product/PricingRule";
import DeliveryRule from "../lib/product/DeliveryRule";
import QuantityPricing from "../lib/product/QuantityPricing";
import PricingEngine from "../lib/PriceEngine";
import PriceCalculationRequest from "../lib/PriceCalculationRequest";
import Attribute from "../lib/product/Attribute";

export async function calculatePrice(req: Request, res: Response) {
  const { productId, quantity, attributes, deliveryMethod } = req.body;
  const currentTime = new Date();
  const vendor = await getVendor(
    productId,
    attributes,
    deliveryMethod,
    currentTime
  );
  if (!vendor) {
    throw new NotFoundException("Vendor not found!");
  }

  const vendorId = vendor._id;
  const matchedDeliverySlot = await getMatchedDeliverySlot(
    vendor,
    productId,
    deliveryMethod
  );
  const vendorProduct = await VendorProductModel.findOne({
    product: productId,
    vendor: vendorId,
  })
    .populate("product")
    .populate("quantityPricings")
    .populate("pricingRules")
    .populate("deliverySlots");

  const productData = await ProductModel.findById(productId);

  const product = new Product(
    productData.name,
    vendorProduct.pricingRules.map(
      (rule: { attribute: string; value: string; price: number }) =>
        new PricingRule(rule.attribute, rule.value, rule.price)
    ),
    vendorProduct.deliverySlots.map(
      (rule: { label: string; price: number }) =>
        new DeliveryRule(rule.label, rule.price)
    ),
    vendorProduct.quantityPricings.map(
      (qp: { quantity: number; price: number }) =>
        new QuantityPricing(qp.quantity, qp.price)
    )
  );

  const pricingEngine = new PricingEngine(product);
  const priceRequest = new PriceCalculationRequest(
    productData.name,
    quantity,
    attributes.map(
      (attr: { name: string; value: string }) =>
        new Attribute(attr.name, attr.value)
    ),
    matchedDeliverySlot.label
  );

  const priceData = pricingEngine.calculatePrice(priceRequest);
  res.status(200).send({
    productName: productData.name,
    quantity,
    ...priceData,
  });
}

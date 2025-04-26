// services/bulkInsertOrUpdateService.ts
import VendorProductModel from "../models/VendorProductModel";
import VendorModel from "../models/VendorModel";
import ProductModel from "../models/ProductModel";
import DeliverySlotModel from "../models/DeliverySlotModel";
import QuantityPricingModel from "../models/QuantityPricingModel";
import PricingRuleModel from "../models/PricingRuleModel";
import { CustomValidationException } from "../Exceptions/CustomValidationException";
import { NotFoundException } from "../Exceptions/NotFoundException";
import { Request, Response } from "express";

export function validateBulkInput(
  pricingRules: any[],
  deliverySlots: any[],
  quantityPricings: any[]
) {
  if (
    !Array.isArray(pricingRules) ||
    !Array.isArray(deliverySlots) ||
    !Array.isArray(quantityPricings)
  ) {
    throw new CustomValidationException(
      "Invalid input. pricingRules, deliverySlots, and quantityPricings must be arrays."
    );
  }

  const combined = [...pricingRules, ...deliverySlots, ...quantityPricings];

  for (const item of combined) {
    if (
      typeof item.product_name !== "string" ||
      typeof item.vendor_email !== "string"
    ) {
      throw new CustomValidationException(
        "Each item must contain valid product_name and vendor_email as strings."
      );
    }
  }
}

export function extractUniqueVendorProductIdentifiers(combinedData: any[]) {
  return combinedData.reduce(
    (acc: { product_name: string; vendor_email: string }[], curr) => {
      if (
        !acc.some(
          (el) =>
            el.vendor_email === curr.vendor_email &&
            el.product_name === curr.product_name
        )
      ) {
        acc.push(curr);
      }
      return acc;
    },
    []
  );
}

export async function validateAndFetchProductVendor(
  product_name: string,
  vendor_email: string
) {
  const product = await ProductModel.findOne({ name: product_name });
  if (!product) {
    throw new NotFoundException(`Product not found for name: ${product_name}`);
  }

  const vendor = await VendorModel.findOne({ email: vendor_email });
  if (!vendor) {
    throw new NotFoundException(`Vendor not found for email: ${vendor_email}`);
  }

  return { product, vendor };
}

export function validatePricingRule(rule: any) {
  if (
    typeof rule.attribute !== "string" ||
    typeof rule.value !== "string" ||
    typeof rule.price !== "number"
  ) {
    throw new CustomValidationException("Invalid pricing rule format.");
  }
}

export function validateDeliverySlot(slot: any) {
  if (typeof slot.label !== "string" || typeof slot.price !== "number") {
    throw new CustomValidationException("Invalid delivery slot format.");
  }
}

export function validateQuantityPricing(pricing: any) {
  if (
    typeof pricing.quantity !== "number" ||
    typeof pricing.price !== "number"
  ) {
    throw new CustomValidationException("Invalid quantity pricing format.");
  }
}

export async function createVendorProduct(
  product: any,
  vendor: any,
  pricingRules: any[],
  deliverySlots: any[],
  quantityPricings: any[]
) {
  const pricingRuleIds = await Promise.all(
    pricingRules.map((rule) => PricingRuleModel.create(rule))
  );

  const deliverySlotIds = await Promise.all(
    deliverySlots.map((slot) => DeliverySlotModel.create(slot))
  );

  const quantityPricingIds = await Promise.all(
    quantityPricings.map((pricing) => QuantityPricingModel.create(pricing))
  );

  return VendorProductModel.create({
    product: product._id,
    vendor: vendor._id,
    pricingRules: pricingRuleIds.map((doc) => doc._id),
    deliverySlots: deliverySlotIds.map((doc) => doc._id),
    quantityPricings: quantityPricingIds.map((doc) => doc._id),
  });
}

export async function bulkInsertOrUpdate(req: Request, res: Response) {
  const { pricingRules, deliverySlots, quantityPricings } = req.body;

  validateBulkInput(pricingRules, deliverySlots, quantityPricings);

  const combinedData = [...pricingRules, ...deliverySlots, ...quantityPricings];
  const vendorProductIdentifiers =
    extractUniqueVendorProductIdentifiers(combinedData);

  const results = [] as any[];

  for (const id of vendorProductIdentifiers) {
    const { product, vendor } = await validateAndFetchProductVendor(
      id.product_name,
      id.vendor_email
    );

    const productPricingRules = pricingRules.filter(
      (rule) =>
        rule.product_name === id.product_name &&
        rule.vendor_email === id.vendor_email
    );

    const productDeliverySlots = deliverySlots.filter(
      (slot) =>
        slot.product_name === id.product_name &&
        slot.vendor_email === id.vendor_email
    );

    const productQuantityPricings = quantityPricings.filter(
      (pricing) =>
        pricing.product_name === id.product_name &&
        pricing.vendor_email === id.vendor_email
    );

    productPricingRules.forEach(validatePricingRule);
    productDeliverySlots.forEach(validateDeliverySlot);
    productQuantityPricings.forEach(validateQuantityPricing);

    const vendorProduct = await createVendorProduct(
      product,
      vendor,
      productPricingRules,
      productDeliverySlots,
      productQuantityPricings
    );

    results.push(vendorProduct);
  }

  res.status(201).json({
    message: "Bulk insert/update completed successfully.",
    vendorProducts: results,
  });
}

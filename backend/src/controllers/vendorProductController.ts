import { Request } from "express-validator/lib/base";
import { Response } from "express";
import VendorProductModel from "../models/VendorProductModel";
import VendorModel from "../models/VendorModel";
import ProductModel from "../models/ProductModel";
import DeliverySlotModel from "../models/DeliverySlotModel";
import QuantityPricingModel from "../models/QuantityPricingModel";
import PricingRuleModel from "../models/PricingRuleModel";

export async function index(req: Request, res: Response) {
  const vendorProducts = await VendorProductModel.find().populate([
    "product",
    "vendor",
    "pricingRules",
    "deliverySlots",
    "quantityPricings",
  ]);
  res.status(200).send({
    vendorProducts,
  });
}
export async function getVendorProduct(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const vendorProduct = await VendorProductModel.findById(id).populate([
    "product",
    "vendor",
    "pricingRules",
    "deliverySlots",
    "quantityPricings",
  ]);
  if (!vendorProduct) {
    res.status(404).send({ message: "Product not found" });

    return;
  }
  res.status(200).send({
    vendorProduct,
  });
}

export async function createVendorProduct(req: Request, res: Response) {
  const { vendorId, productId, pricingRules, deliverySlots, quantityPricing } =
    req.body;
  if (!vendorId) {
    res.status(442).send({ message: "Missing vendor id" });
    return;
  }
  const existingVendorProduct = await VendorProductModel.findOne({
    product: productId,
    vendor: vendorId,
  });
  if (existingVendorProduct) {
    res.status(442).send({ message: "Vendor Product already exists" });
    return;
  }
  const vendor = await VendorModel.findById(vendorId);
  if (!vendor) {
    res.status(404).send({ message: "Vendor not found" });
    return;
  }
  const product = await ProductModel.findOne({ _id: productId });
  const newPricingRules = await PricingRuleModel.insertMany(pricingRules);
  const newDeliverySlots = await DeliverySlotModel.insertMany(deliverySlots);
  const newQuantityPricing = await QuantityPricingModel.insertMany(
    quantityPricing
  );
  const newAssociation = new VendorProductModel({
    vendor,
    product,
    pricingRules: newPricingRules,
    deliverySlots: newDeliverySlots,
    quantityPricing: newQuantityPricing,
  });
  await newAssociation.save();
  res.status(201).send({ product, association: newAssociation });
}
export async function deleteVendorProduct(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const vendorProduct = await VendorProductModel.findById(id).populate([
    "pricingRules",
    "deliverySlots",
    "quantityPricings",
  ]);
  if (!vendorProduct) {
    res.status(404).send({ message: "Vendor Product not found!" });
    return;
  } // Collect all related IDs to delete
  const pricingRuleIds = vendorProduct.pricingRules;
  const deliverySlotIds = vendorProduct.deliverySlots;
  const quantityPricingIds = vendorProduct.quantityPricings;
  // Delete associated records
  if (pricingRuleIds.length)
    await PricingRuleModel.deleteMany({ _id: { $in: pricingRuleIds } });
  if (deliverySlotIds.length)
    await DeliverySlotModel.deleteMany({ _id: { $in: deliverySlotIds } });
  if (quantityPricingIds.length)
    await QuantityPricingModel.deleteMany({
      _id: { $in: quantityPricingIds },
    });
  // Delete vendor and related products
  await VendorProductModel.deleteMany({ _id: id });

  res.status(204).send({ message: "Vendor product deleted!" });
}
export async function updateVendorProduct(req: Request, res: Response) {
  const { id: vendorProductId } = req.params as { id: string };

  const { pricingRules, deliverySlots, quantityPricings } = req.body;
  // Validate product exists
  const vendorProduct = await VendorProductModel.findById(vendorProductId);
  if (!vendorProduct) {
    res.status(404).send({ message: "Vendor Product not found!" });
    return;
  }

  // Remove previous values
  await PricingRuleModel.deleteMany({
    _id: { $in: vendorProduct.pricingRules },
  });
  await DeliverySlotModel.deleteMany({
    _id: { $in: vendorProduct.deliverySlots },
  });
  await QuantityPricingModel.deleteMany({
    _id: { $in: vendorProduct.quantityPricings },
  });

  // Insert new values
  const updatedPricingRules = await PricingRuleModel.insertMany(pricingRules);
  const updatedDeliverySlots = await DeliverySlotModel.insertMany(
    deliverySlots
  );
  const updatedQuantityPricing = await QuantityPricingModel.insertMany(
    quantityPricings
  );

  // Update vendorProduct with new associations
  const updatedVendorProduct = await VendorProductModel.findByIdAndUpdate(
    vendorProductId,
    {
      pricingRules: updatedPricingRules.map((rule) => rule._id),
      deliverySlots: updatedDeliverySlots.map((slot) => slot._id),
      quantityPricings: updatedQuantityPricing.map((price) => price._id),
    },
    { new: true }
  ).populate([
    "product",
    "vendor",
    "pricingRules",
    "deliverySlots",
    "quantityPricings",
  ]);
  res.status(200).send({
    message: "Product updated successfully",
    vendorProduct: updatedVendorProduct,
  });
}
export async function bulkInsertOrUpdate(req: Request, res: Response) {
  const { vendors } = req.body;

  if (!vendors || !Array.isArray(vendors) || vendors.length === 0) {
    res.status(442).send({ message: "Missing or invalid vendor data" });
    return;
  }
  // Check for duplicate emails in the database
  const existingEmails = await VendorModel.find({
    email: { $in: vendors.map((v) => v.email) },
  }).distinct("email");
  if (existingEmails.length > 0) {
    res.status(442).send({ message: "Some emails are already taken" });
    return;
  }
  // Save multiple vendors
  const savedVendors = await VendorModel.insertMany(vendors);

  res.status(201).send({ message: "Vendors created", vendors: savedVendors });
}

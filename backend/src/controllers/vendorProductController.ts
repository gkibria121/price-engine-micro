import { Request } from "express-validator/lib/base";
import { Response } from "express";
import VendorProductModel from "../models/VendorProductModel";
import VendorModel from "../models/VendorModel";
import ProductModel from "../models/ProductModel";
import DeliverySlotModel from "../models/DeliverySlotModel";
import QuantityPricingModel from "../models/QuantityPricingModel";
import PricingRuleModel from "../models/PricingRuleModel";
import { NotFoundException } from "../Exceptions/NotFoundException";
import { CustomValidationException } from "../Exceptions/CustomValidationException";
import {
  createVendorProduct,
  validateBulkStoreRequest,
} from "../services/bulkInsertOrUpdateService";
import PricingRuleMetaModel from "../models/PricingRuleMetaModel";
import { getVendorsByProductAndDelivery } from "../services/vendorProductService";
import { populateAllRefsMany } from "../utils/functions";

export async function index(req: Request, res: Response) {
  const vendorProducts = await VendorProductModel.find().populate([
    "product",
    "vendor",
    "pricingRules",
    "deliverySlots",
    "quantityPricings",
    "pricingRuleMetas",
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
    "pricingRuleMetas",
  ]);
  if (!vendorProduct) {
    throw new NotFoundException("Product not found!");
  }
  res.status(200).send({
    vendorProduct,
  });
}

export async function storeVendorProduct(req: Request, res: Response) {
  const {
    vendorId,
    productId,
    pricingRules,
    deliverySlots,
    quantityPricings,
    pricingRuleMetas = [],
    rating,
  } = req.body;
  const existingVendorProduct = await VendorProductModel.findOne({
    product: productId,
    vendor: vendorId,
  });
  if (existingVendorProduct) {
    throw new CustomValidationException("Vendor Product already exists", {
      productId: ["Vendor Product already exists"],
      vendorId: ["Vendor Product already exists"],
    });
  }
  const vendor = await VendorModel.findById(vendorId);
  if (!vendor) {
    throw new NotFoundException("Vendor not found");
  }
  const product = await ProductModel.findOne({ _id: productId });
  const newPricingRules = await PricingRuleModel.insertMany(pricingRules);
  const newDeliverySlots = await DeliverySlotModel.insertMany(deliverySlots);
  const newQuantityPricing = await QuantityPricingModel.insertMany(
    quantityPricings
  );
  const newPricingRuleMetas = await PricingRuleMetaModel.insertMany(
    pricingRuleMetas
  );
  const newAssociation = new VendorProductModel({
    vendor,
    product,
    pricingRules: newPricingRules,
    deliverySlots: newDeliverySlots,
    quantityPricings: newQuantityPricing,
    pricingRuleMetas: newPricingRuleMetas,
    rating,
  });
  await newAssociation.save();
  // Now populate everything properly
  const populatedAssociation = await VendorProductModel.findById(
    newAssociation._id
  ).populate([
    "vendor",
    "product",
    "pricingRules",
    "deliverySlots",
    "quantityPricings",
    "pricingRuleMetas",
  ]);
  res
    .status(201)
    .send({ product, association: populatedAssociation?.toJSON() });
}
export async function deleteVendorProduct(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const vendorProduct = await VendorProductModel.findById(id).populate([
    "pricingRules",
    "deliverySlots",
    "quantityPricings",
  ]);
  if (!vendorProduct) {
    throw new NotFoundException("Vendor Product not found!");
  } // Collect all related IDs to delete
  const pricingRuleIds = vendorProduct.pricingRules;
  const deliverySlotIds = vendorProduct.deliverySlots;
  const quantityPricingIds = vendorProduct.quantityPricings;
  const pricingRuleOptionIds = vendorProduct.pricingRuleMetas;
  // Delete associated records
  if (pricingRuleIds.length)
    await PricingRuleModel.deleteMany({ _id: { $in: pricingRuleIds } });
  if (deliverySlotIds.length)
    await DeliverySlotModel.deleteMany({ _id: { $in: deliverySlotIds } });
  if (quantityPricingIds.length)
    await QuantityPricingModel.deleteMany({
      _id: { $in: quantityPricingIds },
    });
  if (pricingRuleOptionIds.length)
    await PricingRuleMetaModel.deleteMany({
      _id: { $in: pricingRuleOptionIds },
    });
  // Delete vendor and related products
  await VendorProductModel.deleteMany({ _id: id });

  res.status(204).send({ message: "Vendor product deleted!" });
}
export async function updateVendorProduct(req: Request, res: Response) {
  const { id: vendorProductId } = req.params as { id: string };

  const {
    pricingRules,
    deliverySlots,
    quantityPricings,
    pricingRuleMetas = [],
    rating,
  } = req.body;
  // Validate product exists
  const vendorProduct = await VendorProductModel.findById(vendorProductId);
  if (!vendorProduct) {
    throw new NotFoundException("Vendor Product not found!");
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
  await PricingRuleMetaModel.deleteMany({
    _id: { $in: vendorProduct.pricingRuleMetas },
  });
  // Insert new values
  const updatedPricingRules = await PricingRuleModel.insertMany(pricingRules);
  const updatedDeliverySlots = await DeliverySlotModel.insertMany(
    deliverySlots
  );
  const updatedQuantityPricing = await QuantityPricingModel.insertMany(
    quantityPricings
  );
  const updatedPricingRuleMetas = await PricingRuleMetaModel.insertMany(
    pricingRuleMetas
  );

  // Update vendorProduct with new associations
  const updatedVendorProduct = await VendorProductModel.findByIdAndUpdate(
    vendorProductId,
    {
      pricingRules: updatedPricingRules.map((rule) => rule._id),
      deliverySlots: updatedDeliverySlots.map((slot) => slot._id),
      quantityPricings: updatedQuantityPricing.map((price) => price._id),
      pricingRuleMetas: updatedPricingRuleMetas.map((price) => price._id),
      rating,
    },
    { new: true }
  ).populate([
    "product",
    "vendor",
    "pricingRules",
    "deliverySlots",
    "quantityPricings",
    "pricingRuleMetas",
  ]);
  res.status(200).send({
    message: "Product updated successfully",
    vendorProduct: updatedVendorProduct,
  });
}

export async function bulkStore(req: Request, res: Response) {
  const { vendorProducts } = req.body;
  await validateBulkStoreRequest(vendorProducts);
  const results = [] as any[];

  for (const vendorProduct of vendorProducts) {
    const {
      productId,
      vendorId,
      pricingRules: productPricingRules,
      deliverySlots: productDeliverySlots,
      quantityPricings: productQuantityPricings,
      pricingRuleMetas = [],
      rating,
    } = vendorProduct;
    const product = await ProductModel.findById(productId);
    const vendor = await VendorModel.findById(vendorId);

    if (!product) {
      throw new CustomValidationException("Product not found!", {
        productId: ["Product not found!"],
      });
    }
    if (!vendor) {
      throw new CustomValidationException("vendor not found!", {
        vendorId: ["vendor not found!"],
      });
    }
    const newVendorProduct = await createVendorProduct(
      product,
      vendor,
      productPricingRules,
      productDeliverySlots,
      productQuantityPricings,
      pricingRuleMetas,
      rating
    );

    results.push(newVendorProduct);
  }

  res.status(201).json({
    message: "Bulk insert/update completed successfully.",
    vendorProducts: results,
  });
}
export async function getMatchedVendorProducts(req: Request, res: Response) {
  const { productId, deliveryMethod } = req.body; // deliverySlot = string label
  // Step 1: Find all vendor products for the product
  const vendorIds = await getVendorsByProductAndDelivery(
    productId,
    deliveryMethod
  );
  const matchedVendorProducts = await VendorProductModel.find({
    product: productId,
    vendor: { $in: vendorIds },
  });

  const populatedAssociations = await populateAllRefsMany(
    matchedVendorProducts,
    VendorProductModel.schema
  );

  res.status(200).send({
    vendorProducts: populatedAssociations,
  });
}

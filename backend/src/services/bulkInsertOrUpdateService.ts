// services/bulkInsertOrUpdateService.ts
import VendorProductModel from "../models/VendorProductModel";
import VendorModel from "../models/VendorModel";
import ProductModel from "../models/ProductModel";
import DeliverySlotModel from "../models/DeliverySlotModel";
import QuantityPricingModel from "../models/QuantityPricingModel";
import PricingRuleModel from "../models/PricingRuleModel";
import { CustomValidationException } from "../Exceptions/CustomValidationException";
import PricingRuleMetaModel from "../models/PricingRuleMetaModel";
export async function createVendorProduct(
  product: any,
  vendor: any,
  pricingRules: any[],
  deliverySlots: any[],
  quantityPricings: any[],
  pricingRuleMetas: any[] = []
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

  const pricingRuleOptionIds = await Promise.all(
    pricingRuleMetas.map((rule) => PricingRuleMetaModel.create(rule))
  );

  return VendorProductModel.create({
    product: product._id,
    vendor: vendor._id,
    pricingRules: pricingRuleIds.map((doc) => doc._id),
    deliverySlots: deliverySlotIds.map((doc) => doc._id),
    quantityPricings: quantityPricingIds.map((doc) => doc._id),
    pricingRuleMetas: pricingRuleOptionIds.map((doc) => doc._id),
  });
}

export async function validateBulkStoreRequest(vendorProducts: any[]) {
  const errors: Record<string, string[]> = {};

  for (let index = 0; index < vendorProducts.length; index++) {
    const vendorProduct = vendorProducts[index];
    const { productId, vendorId } = vendorProduct;

    const product = await ProductModel.findById(productId);
    const vendor = await VendorModel.findById(vendorId);

    if (!product) {
      errors[`vendorProducts.${index}.productId`] = ["Product not found"];
    }

    if (!vendor) {
      errors[`vendorProducts.${index}.vendorId`] = ["Vendor not found"];
    }

    const existingVendorProduct = await VendorProductModel.findOne({
      product: productId,
      vendor: vendorId,
    });

    if (existingVendorProduct) {
      errors[`vendorProducts.${index}.vendorId`] = [
        "VendorProduct already exists",
      ];
      errors[`vendorProducts.${index}.productId`] = [
        "VendorProduct already exists",
      ];
    }
  }

  if (Object.keys(errors).length !== 0) {
    throw new CustomValidationException("Some data are not valid.", errors);
  }
}

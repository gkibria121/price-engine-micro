import express from "express";
import {
  bulkInsertOrUpdate,
  storeVendorProduct,
  deleteVendorProduct,
  getVendorProduct,
  index,
  updateVendorProduct,
} from "../controllers/vendorProductController";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/ValidateRequestMiddleware";

const router = express.Router();

// ----------- Common Validation Rules -------------
const pricingRulesValidation = (fieldPrefix = "pricingRules") => [
  body(`${fieldPrefix}`)
    .exists({ checkFalsy: true })
    .withMessage(`${fieldPrefix} is required`)
    .isArray({ min: 1 })
    .withMessage(`${fieldPrefix} must be a non-empty array`),
  body(`${fieldPrefix}.*.attribute`)
    .exists({ checkFalsy: true })
    .withMessage(`attribute is required`)
    .isString()
    .withMessage(`attribute must be a string`),
  body(`${fieldPrefix}.*.value`)
    .exists({ checkFalsy: true })
    .withMessage(`value is required`)
    .isString()
    .withMessage(`value must be a string`),
  body(`${fieldPrefix}.*.price`)
    .exists({ checkFalsy: true })
    .withMessage(`price is required`)
    .isNumeric()
    .withMessage(`price must be a number`),
];

const deliverySlotsValidation = (fieldPrefix = "deliverySlots") => [
  body(`${fieldPrefix}`)
    .exists({ checkFalsy: true })
    .withMessage(`${fieldPrefix} is required`)
    .isArray({ min: 1 })
    .withMessage(`${fieldPrefix} must be a non-empty array`),
  body(`${fieldPrefix}.*.price`)
    .exists({ checkFalsy: true })
    .withMessage("deliverySlot.price is required")
    .isNumeric()
    .withMessage("deliverySlot.price must be a number"),
  body(`${fieldPrefix}.*.cutoffTime`)
    .exists({ checkFalsy: true })
    .withMessage("cutoffTime is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("cutoffTime must be in HH:mm format"),
  body(`${fieldPrefix}.*.deliveryTimeStartTime`)
    .exists({ checkFalsy: true })
    .withMessage("deliveryTimeStartTime is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("deliveryTimeStartTime must be in HH:mm format"),
  body(`${fieldPrefix}.*.deliveryTimeEndTime`)
    .exists({ checkFalsy: true })
    .withMessage("deliveryTimeEndTime is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("deliveryTimeEndTime must be in HH:mm format"),
  body(`${fieldPrefix}.*.deliveryTimeStartDate`)
    .exists({ checkFalsy: false })
    .withMessage("deliveryTimeStartDate is required")
    .isNumeric()
    .withMessage("deliveryTimeStartDate must be a number"),
  body(`${fieldPrefix}.*.deliveryTimeEndDate`)
    .exists({ checkFalsy: false })
    .withMessage("deliveryTimeEndDate is required")
    .isNumeric()
    .withMessage("deliveryTimeEndDate must be a number"),
  body(`${fieldPrefix}.*.label`)
    .exists({ checkFalsy: true })
    .withMessage("label is required")
    .isString()
    .withMessage("label must be a string"),
];

const quantityPricingsValidation = (fieldPrefix = "quantityPricings") => [
  body(`${fieldPrefix}`)
    .exists({ checkFalsy: true })
    .withMessage(`${fieldPrefix} is required`)
    .isArray({ min: 1 })
    .withMessage(`${fieldPrefix} must be a non-empty array`),
  body(`${fieldPrefix}.*.quantity`)
    .exists({ checkFalsy: true })
    .withMessage("quantity is required")
    .isNumeric()
    .withMessage("quantity must be a number"),
  body(`${fieldPrefix}.*.price`)
    .exists({ checkFalsy: true })
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price must be a number"),
];

// ----------- Validation Arrays -------------
const createVendorProductValidation = [
  body("vendorId")
    .exists({ checkFalsy: true })
    .withMessage("vendorId is required")
    .isMongoId()
    .withMessage("vendorId must be a valid MongoID"),
  body("productId")
    .exists({ checkFalsy: true })
    .withMessage("productId is required")
    .isMongoId()
    .withMessage("productId must be a valid MongoID"),
  ...pricingRulesValidation(),
  ...deliverySlotsValidation(),
  ...quantityPricingsValidation(),
];

const updateVendorProductValidation = [
  ...pricingRulesValidation(),
  ...deliverySlotsValidation(),
  ...quantityPricingsValidation(),
];

const bulkUploadVendorProductValidation = [
  body("pricingRules.*.product_name")
    .exists({ checkFalsy: true })
    .withMessage("Each pricingRule must contain valid product_name"),

  body("pricingRules.*.vendor_email")
    .exists({ checkFalsy: true })
    .withMessage("Each pricingRule must contain valid vendor_email"),
  body("deliverySlots.*.product_name")
    .exists({ checkFalsy: true })
    .withMessage("Each deliverySlot must contain valid product_name"),

  body("deliverySlots.*.vendor_email")
    .exists({ checkFalsy: true })
    .withMessage("Each deliverySlot must contain valid vendor_email"),
  body("quantityPricings.*.product_name")
    .exists({ checkFalsy: true })
    .withMessage("Each quantityPricing must contain valid product_name"),

  body("quantityPricings.*.vendor_email")
    .exists({ checkFalsy: true })
    .withMessage("Each quantityPricing must contain valid vendor_email"),
  ...pricingRulesValidation(),
  ...deliverySlotsValidation(),
  ...quantityPricingsValidation(),
];

// ----------- Routes -------------

router.get("/vendor-products", index);

router.post(
  "/vendor-products/store",
  createVendorProductValidation,
  validateRequest,
  storeVendorProduct
);

router.get("/vendor-products/:id", getVendorProduct);

router.put(
  "/vendor-products/:id",
  updateVendorProductValidation,
  validateRequest,
  updateVendorProduct
);

router.delete("/vendor-products/:id", deleteVendorProduct);

router.post(
  "/vendor-products/bulk-upload",
  bulkUploadVendorProductValidation,
  validateRequest,
  bulkInsertOrUpdate
);

export default router;

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

router.route("/vendor-products").get(index);
router.route("/vendor-products/store").post(
  [
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

    body("pricingRules")
      .exists({ checkFalsy: true })
      .withMessage("pricingRules is required")
      .isArray({ min: 1 })
      .withMessage("pricingRules must be a non-empty array"),

    body("pricingRules.*.attribute")
      .exists({ checkFalsy: true })
      .withMessage("attribute is required")
      .isString()
      .withMessage("attribute must be a string"),

    body("pricingRules.*.value")
      .exists({ checkFalsy: true })
      .withMessage("value is required")
      .isString()
      .withMessage("value must be a string"),

    body("pricingRules.*.price")
      .exists({ checkFalsy: true })
      .withMessage("price is required")
      .isNumeric()
      .withMessage("price must be a number"),

    body("deliverySlots")
      .exists({ checkFalsy: true })
      .withMessage("deliverySlots is required")
      .isArray({ min: 1 })
      .withMessage("deliverySlots must be a non-empty array"),

    body("deliverySlots.*.price")
      .exists({ checkFalsy: true })
      .withMessage("deliverySlot.price is required")
      .isNumeric()
      .withMessage("deliverySlot.price must be a number"),

    body("deliverySlots.*.cutoffTime")
      .exists({ checkFalsy: true })
      .withMessage("cutoffTime is required")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("cutoffTime must be in HH:mm format"),

    body("deliverySlots.*.deliveryTimeStartTime")
      .exists({ checkFalsy: true })
      .withMessage("deliveryTimeStartTime is required")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("deliveryTimeStartTime must be in HH:mm format"),

    body("deliverySlots.*.deliveryTimeEndTime")
      .exists({ checkFalsy: true })
      .withMessage("deliveryTimeEndTime is required")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("deliveryTimeEndTime must be in HH:mm format"),

    body("deliverySlots.*.deliveryTimeStartDate")
      .exists({ checkFalsy: true })
      .withMessage("deliveryTimeStartDate is required")
      .isNumeric()
      .withMessage("deliveryTimeStartDate must be a number"),

    body("deliverySlots.*.deliveryTimeEndDate")
      .exists({ checkFalsy: true })
      .withMessage("deliveryTimeEndDate is required")
      .isNumeric()
      .withMessage("deliveryTimeEndDate must be a number"),

    body("deliverySlots.*.label")
      .exists({ checkFalsy: true })
      .withMessage("label is required")
      .isString()
      .withMessage("label must be a string"),

    body("quantityPricings")
      .exists({ checkFalsy: true })
      .withMessage("quantityPricings is required")
      .isArray({ min: 1 })
      .withMessage("quantityPricings must be a non-empty array"),

    body("quantityPricings.*.quantity")
      .exists({ checkFalsy: true })
      .withMessage("quantity is required")
      .isNumeric()
      .withMessage("quantity must be a number"),

    body("quantityPricings.*.price")
      .exists({ checkFalsy: true })
      .withMessage("price is required")
      .isNumeric()
      .withMessage("price must be a number"),
  ],
  validateRequest,
  storeVendorProduct
);
router.route("/vendor-products/:id").get(getVendorProduct);
router.route("/vendor-products/:id").put(
  [
    body("pricingRules")
      .exists({ checkFalsy: true })
      .withMessage("pricingRules is required")
      .isArray({ min: 1 })
      .withMessage("pricingRules must be a non-empty array"),

    body("pricingRules.*.attribute")
      .exists({ checkFalsy: true })
      .withMessage("attribute is required")
      .isString()
      .withMessage("attribute must be a string"),

    body("pricingRules.*.value")
      .exists({ checkFalsy: true })
      .withMessage("value is required")
      .isString()
      .withMessage("value must be a string"),

    body("pricingRules.*.price")
      .exists({ checkFalsy: true })
      .withMessage("price is required")
      .isNumeric()
      .withMessage("price must be a number"),

    body("deliverySlots")
      .exists({ checkFalsy: true })
      .withMessage("deliverySlots is required")
      .isArray({ min: 1 })
      .withMessage("deliverySlots must be a non-empty array"),

    body("deliverySlots.*.price")
      .exists({ checkFalsy: true })
      .withMessage("deliverySlot.price is required")
      .isNumeric()
      .withMessage("deliverySlot.price must be a number"),

    body("deliverySlots.*.cutoffTime")
      .exists({ checkFalsy: true })
      .withMessage("cutoffTime is required")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("cutoffTime must be in HH:mm format"),

    body("deliverySlots.*.deliveryTimeStartTime")
      .exists({ checkFalsy: true })
      .withMessage("deliveryTimeStartTime is required")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("deliveryTimeStartTime must be in HH:mm format"),

    body("deliverySlots.*.deliveryTimeEndTime")
      .exists({ checkFalsy: true })
      .withMessage("deliveryTimeEndTime is required")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("deliveryTimeEndTime must be in HH:mm format"),

    body("deliverySlots.*.deliveryTimeStartDate")
      .exists({ checkFalsy: true })
      .withMessage("deliveryTimeStartDate is required")
      .isNumeric()
      .withMessage("deliveryTimeStartDate must be a number"),

    body("deliverySlots.*.deliveryTimeEndDate")
      .exists({ checkFalsy: true })
      .withMessage("deliveryTimeEndDate is required")
      .isNumeric()
      .withMessage("deliveryTimeEndDate must be a number"),

    body("deliverySlots.*.label")
      .exists({ checkFalsy: true })
      .withMessage("label is required")
      .isString()
      .withMessage("label must be a string"),

    body("quantityPricings")
      .exists({ checkFalsy: true })
      .withMessage("quantityPricings is required")
      .isArray({ min: 1 })
      .withMessage("quantityPricings must be a non-empty array"),

    body("quantityPricings.*.quantity")
      .exists({ checkFalsy: true })
      .withMessage("quantity is required")
      .isNumeric()
      .withMessage("quantity must be a number"),

    body("quantityPricings.*.price")
      .exists({ checkFalsy: true })
      .withMessage("price is required")
      .isNumeric()
      .withMessage("price must be a number"),
  ],
  validateRequest,
  updateVendorProduct
);
router.route("/vendor-products/:id").delete(deleteVendorProduct);
router.route("/vendor-products/bulk-upload").post(bulkInsertOrUpdate);

export default router;

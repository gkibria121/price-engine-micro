import express from "express";
import { calculatePriceWithVendor } from "../controllers/priceCalculationController";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/ValidateRequestMiddleware";

const router = express.Router();

router
  .route("/calculate-price-with-vendor")
  .post(
    [
      body("productId")
        .notEmpty()
        .withMessage("productId is required")
        .isMongoId()
        .withMessage("productId must be a valid MongoID"),
      body("vendorId")
        .notEmpty()
        .withMessage("vendorId is required")
        .isMongoId()
        .withMessage("vendorId must be a valid MongoID"),
      body("quantity")
        .notEmpty()
        .withMessage("quantity is required")
        .isNumeric()
        .withMessage("quantity must be a number"),

      body("attributes")
        .isArray({ min: 1 })
        .withMessage("attributes must be a non-empty array"),

      body("attributes.*.name")
        .notEmpty()
        .withMessage("Each attribute must have a name")
        .isString()
        .withMessage("Attribute name must be a string"),

      body("attributes.*.value")
        .notEmpty()
        .withMessage("Each attribute must have a value")
        .isString()
        .withMessage("Attribute value must be a string"),

      body("deliveryMethod")
        .notEmpty()
        .withMessage("deliveryMethod is required")
        .isObject()
        .withMessage("deliveryMethod must be an object"),

      body("deliveryMethod.label")
        .notEmpty()
        .withMessage("deliveryMethod.label is required")
        .isString()
        .withMessage("deliveryMethod.label must be a string"),
    ],
    validateRequest,
    calculatePriceWithVendor
  );

export default router;

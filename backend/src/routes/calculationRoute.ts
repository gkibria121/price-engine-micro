import express from "express";
import { calculatePrice } from "../controllers/priceCalculationController";
import { body } from "express-validator";

const router = express.Router();

router
  .route("/products")
  .get(
    [
      body("productId")
        .notEmpty()
        .withMessage("productId is required")
        .isMongoId()
        .withMessage("productId must be mongoId"),
      body("quantity")
        .notEmpty()
        .withMessage("quantity is required")
        .isNumeric()
        .withMessage("quantity must be number"),
    ],
    calculatePrice
  );

export default router;

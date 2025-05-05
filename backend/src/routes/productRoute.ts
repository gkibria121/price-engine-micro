import express, { NextFunction, Request, Response } from "express";
import {
  bulkInsert,
  createProduct,
  deleteProduct,
  getProduct,
  index,
  updateProduct,
} from "../controllers/productController";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/ValidateRequestMiddleware";
import { validateObjectId } from "../middlewares/validateObjectId";
import { z, ZodError } from "zod";
import { ZodRequestValidationMiddleware } from "../middlewares/ZodRequestValidationMiddleware";
import { bulkProductsSchema, productSchema } from "@daynightprint/shared";
// Validation middleware for bulk upload

const router = express.Router();

router.route("/products").get(index);
router
  .route("/products")
  .post(
    ZodRequestValidationMiddleware(productSchema.omit({ id: true })),
    createProduct
  );
router
  .route("/products/bulk-upload")
  .post(
    ZodRequestValidationMiddleware(bulkProductsSchema),
    validateRequest,
    bulkInsert
  );
router.route("/products/:id").get(validateObjectId("id"), getProduct);
router
  .route("/products/:id")
  .put(
    ZodRequestValidationMiddleware(productSchema.omit({ id: true })),
    validateObjectId("id"),
    updateProduct
  );
router.route("/products/:id").delete(deleteProduct);

export default router;

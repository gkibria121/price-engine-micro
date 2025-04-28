import express from "express";
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
// Validation middleware for bulk upload
export const validateBulkUpload = [
  // Check that 'products' is an array and not empty
  body("products")
    .isArray({ min: 1 })
    .withMessage("Products must be an array")
    .notEmpty()
    .withMessage("Products array cannot be empty"),

  // Check that each product has a 'name' and it's a non-empty string
  body("products.*.name")
    .exists()
    .withMessage("Each product must have a 'name'")
    .isString()
    .withMessage("Product 'name' must be a string")
    .notEmpty()
    .withMessage("Product 'name' cannot be empty"),

  // Custom validator to ensure 'name' fields are unique
  body("products").custom((products) => {
    const names = products.map((product: { name: string }) => product.name);
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
      throw new Error("Product names must be unique");
    }
    return true;
  }),
];

const router = express.Router();

router.route("/products").get(index);
router
  .route("/products")
  .post(
    [body("name").notEmpty().withMessage("Name is required")],
    validateRequest,
    createProduct
  );
router
  .route("/products/bulk-upload")
  .post(validateBulkUpload, validateRequest, bulkInsert);
router.route("/products/:id").get(validateObjectId("id"), getProduct);
router
  .route("/products/:id")
  .put(
    [body("name").notEmpty().withMessage("Name is required")],
    validateRequest,
    validateObjectId("id"),
    updateProduct
  );
router.route("/products/:id").delete(deleteProduct);

export default router;

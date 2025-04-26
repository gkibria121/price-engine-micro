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

const router = express.Router();

router.route("/products").get(index);
router
  .route("/products")
  .post(
    [body("name").notEmpty().withMessage("Name is required")],
    validateRequest,
    createProduct
  );
router.route("/products/bulk-upload").post(bulkInsert);
router.route("/products/:id").get(getProduct);
router
  .route("/products/:id")
  .put(
    [body("name").notEmpty().withMessage("Name is required")],
    validateRequest,
    updateProduct
  );
router.route("/products/:id").delete(deleteProduct);

export default router;

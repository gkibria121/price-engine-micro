import express from "express";
import {
  bulkInsertOrUpdate,
  createProduct,
  deleteProduct,
  getProduct,
  index,
  updateProduct,
} from "../controllers/productController";

const router = express.Router();

router.route("/products").get(index);
router.route("/products").post(createProduct);
router.route("/products/bulk-upload").post(bulkInsertOrUpdate);
router.route("/products/:id").get(getProduct);
router.route("/products/:id").put(updateProduct);
router.route("/products/:id").delete(deleteProduct);

export default router;

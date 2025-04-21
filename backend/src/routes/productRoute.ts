import express from "express";
import {
  bulkInsert,
  createProduct,
  deleteProduct,
  getProduct,
  index,
  updateProduct,
} from "../controllers/productController";

const router = express.Router();

router.route("/products").get(index);
router.route("/products").post(createProduct);
router.route("/products/bulk-upload").post(bulkInsert);
router.route("/products/:id").get(getProduct);
router.route("/products/:id").put(updateProduct);
router.route("/products/:id").delete(deleteProduct);

export default router;

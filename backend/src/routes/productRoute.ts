import express from "express";
import {
  bulkInsertOrUpdate,
  createProduct,
  index,
} from "../controllers/productController";

const router = express.Router();

router.route("/products").get(index);
router.route("/products").post(createProduct);
router.route("/products/bulk-upload").post(bulkInsertOrUpdate);

export default router;

import express from "express";
import {
  bulkInsertOrUpdate,
  createVendorProduct,
  deleteVendorProduct,
  getVendorProduct,
  index,
  updateVendorProduct,
} from "../controllers/vendorProductController";

const router = express.Router();

router.route("/vendor-products").get(index);
router.route("/vendor-products/store").post(createVendorProduct);
router.route("/vendor-products/:id").get(getVendorProduct);
router.route("/vendor-products/:id").put(updateVendorProduct);
router.route("/vendor-products/:id").delete(deleteVendorProduct);
router.route("/vendor-products/bulk-upload").post(bulkInsertOrUpdate);

export default router;

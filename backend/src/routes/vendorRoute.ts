import express from "express";
import {
  bulkInsertOrUpdate,
  createVendor,
  deleteVendor,
  index,
  updateVendor,
} from "../controllers/vendorController";

const router = express.Router();

router.route("/vendors").get(index);
router.route("/vendors/store").post(createVendor);
router.route("/vendors/:id").post(updateVendor);
router.route("/vendors/:id").delete(deleteVendor);
router.route("/vendors/bulk-upload").post(bulkInsertOrUpdate);

export default router;

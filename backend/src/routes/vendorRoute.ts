import express from "express";
import {
  bulkInsertOrUpdate,
  createVendor,
  deleteVendor,
  getVendor,
  index,
  updateVendor,
} from "../controllers/vendorController";
import { validateObjectId } from "../middlewares/validateObjectId";
import { ZodRequestValidationMiddleware } from "../middlewares/ZodRequestValidationMiddleware";
import {
  productSchema,
  vendorFormSchema,
  vendorSchema,
} from "@daynightprint/shared";

const router = express.Router();

router.route("/vendors").get(index);
router
  .route("/vendors/store")
  .post(
    ZodRequestValidationMiddleware(vendorSchema.omit({ id: true })),
    createVendor
  );
router
  .route("/vendors/:id")
  .put(
    ZodRequestValidationMiddleware(vendorSchema.omit({ id: true })),
    validateObjectId("id"),
    updateVendor
  );
router.route("/vendors/:id").delete(validateObjectId("id"), deleteVendor);
router.route("/vendors/:id").get(validateObjectId("id"), getVendor);
router
  .route("/vendors/bulk-store")
  .post(ZodRequestValidationMiddleware(vendorFormSchema), bulkInsertOrUpdate);

export default router;

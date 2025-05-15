import express from "express";
import {
  storeVendorProduct,
  deleteVendorProduct,
  getVendorProduct,
  index,
  updateVendorProduct,
  bulkStore,
  getMatchedVendorProducts,
} from "../controllers/vendorProductController";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/ValidateRequestMiddleware";
import { validateObjectId } from "../middlewares/validateObjectId";
import { ZodRequestValidationMiddleware } from "../middlewares/ZodRequestValidationMiddleware";
import {
  deliverySlotSchem,
  VendorProductFormSchema,
  vendorProductSchema,
} from "@daynightprint/shared";
import { z } from "zod";

const router = express.Router();

router.get("/vendor-products", index);
router.post(
  "/vendor-products/get-matched",

  ZodRequestValidationMiddleware(
    z.object({
      productId: z.string(),
      deliveryMethod: deliverySlotSchem,
    })
  ),
  getMatchedVendorProducts
);

router.post(
  "/vendor-products/store",
  [
    body("vendorId")
      .exists({ checkFalsy: true })
      .withMessage("vendorId is required")
      .isMongoId()
      .withMessage("vendorId must be a valid MongoID"),
    body("productId")
      .exists({ checkFalsy: true })
      .withMessage("productId is required")
      .isMongoId()
      .withMessage("productId must be a valid MongoID"),
  ],
  validateRequest,
  ZodRequestValidationMiddleware(
    vendorProductSchema.omit({ id: true, product: true, vendor: true })
  ),
  validateRequest,
  storeVendorProduct
);

router.get("/vendor-products/:id", validateObjectId("id"), getVendorProduct);

router.put(
  "/vendor-products/:id",
  validateObjectId("id"),
  ZodRequestValidationMiddleware(
    vendorProductSchema.omit({ id: true, product: true, vendor: true })
  ),
  validateRequest,
  updateVendorProduct
);

router.delete(
  "/vendor-products/:id",
  validateObjectId("id"),
  deleteVendorProduct
);

router.post(
  "/vendor-products/bulk-store",
  ZodRequestValidationMiddleware(VendorProductFormSchema),
  [
    body("vendorProducts.*.vendorId")
      .exists({ checkFalsy: true })
      .withMessage("vendorId is required")
      .isMongoId()
      .withMessage("vendorId must be a valid MongoID"),
    body("vendorProducts.*.productId")
      .exists({ checkFalsy: true })
      .withMessage("productId is required")
      .isMongoId()
      .withMessage("productId must be a valid MongoID"),
  ],
  validateRequest,

  bulkStore
);
export default router;

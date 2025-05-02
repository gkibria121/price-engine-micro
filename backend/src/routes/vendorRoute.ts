import express from "express";
import {
  bulkInsertOrUpdate,
  createVendor,
  deleteVendor,
  getVendor,
  index,
  updateVendor,
} from "../controllers/vendorController";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/ValidateRequestMiddleware";
import { validateObjectId } from "../middlewares/validateObjectId";
const validateBulkVendors = [
  body()
    .isArray({ min: 1 })
    .withMessage("Request body must be a non-empty array"),
  body("*.name").notEmpty().withMessage("Name is required"),
  body("*.email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("This field must be a valid email."),
  body("*.address").notEmpty().withMessage("Address is required"),
  body("*.rating")
    .notEmpty()
    .withMessage("Rating is required")
    .bail()
    .isNumeric()
    .withMessage("Rating must be a number"),
  validateRequest,
];
const router = express.Router();

router.route("/vendors").get(index);
router
  .route("/vendors/store")
  .post(
    [
      body("name").notEmpty().withMessage("Name is required"),
      body("email").notEmpty().withMessage("Email is required"),
      body("email")
        .notEmpty()
        .isEmail()
        .withMessage("This field must be a valid email."),
      body("address").notEmpty().withMessage("Address is required"),
      body("rating").notEmpty().withMessage("Rating is required"),
      body("rating")
        .notEmpty()
        .isNumeric()
        .withMessage("Rating must be Number"),
      validateRequest,
    ],
    createVendor
  );
router
  .route("/vendors/:id")
  .put(
    [
      body("name").notEmpty().withMessage("Name is required"),
      body("email").notEmpty().withMessage("Email is required"),
      body("email")
        .notEmpty()
        .isEmail()
        .withMessage("This field must be a valid email."),
      body("address").notEmpty().withMessage("Address is required"),
      body("rating").notEmpty().withMessage("Rating is required"),
      body("rating")
        .notEmpty()
        .isNumeric()
        .withMessage("Rating must be Number"),
      validateRequest,
    ],
    validateObjectId("id"),
    updateVendor
  );
router.route("/vendors/:id").delete(validateObjectId("id"), deleteVendor);
router.route("/vendors/:id").get(validateObjectId("id"), getVendor);
router
  .route("/vendors/bulk-store")
  .post(validateBulkVendors, bulkInsertOrUpdate);

export default router;

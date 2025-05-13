import express from "express";
import {
  getProductDeliverySlots,
  index,
} from "../controllers/deliverySlotController";
import { validateObjectId } from "../middlewares/validateObjectId";

const router = express.Router();

router.route("/delivery-slots").get(index);
router
  .route("/delivery-slots/:productId")
  .get(validateObjectId("productId"), getProductDeliverySlots);

export default router;

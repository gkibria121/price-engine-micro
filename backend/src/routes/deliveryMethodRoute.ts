import express from "express";
import { index } from "../controllers/deliverySlotController";

const router = express.Router();

router.route("/delivery-slots").get(index);

export default router;

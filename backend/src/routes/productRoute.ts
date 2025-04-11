import express from "express";
import { index } from "../controllers/productController";

const router = express.Router();

router.route("/products").get(index);

export default router;

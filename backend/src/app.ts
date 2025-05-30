import express from "express";
import product from "./routes/productRoute";
import vendor from "./routes/vendorRoute";
import vendorProduct from "./routes/vendorProductRotue";
import { errorHandler } from "./middlewares/ErrorHandlerMiddleware";
import "express-async-errors";
import calculatePrice from "./routes/calculationRoute";
import calculatePriceWithVendor from "./routes/calculationRoute2";
import deliveryMethodRoute from "./routes/deliveryMethodRoute";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/", product);
app.use("/api/v1/", vendor);
app.use("/api/v1/", vendorProduct);
app.use("/api/v1/", calculatePrice);
app.use("/api/v1/", calculatePriceWithVendor);
app.use("/api/v1/", deliveryMethodRoute);

app.use(errorHandler);
export default app;

import express from "express";
import product from "./routes/productRoute";
import vendor from "./routes/vendorRoute";
import vendorProduct from "./routes/vendorProductRotue";
import { validateRequest } from "./middlewares/ValidateRequestMiddleware";
import { errorHandler } from "./middlewares/ErrorHandlerMiddleware";
const app = express();

app.use(express.json());
app.use("/api/v1/", product);
app.use("/api/v1/", vendor);
app.use("/api/v1/", vendorProduct);

app.use(errorHandler);
export default app;

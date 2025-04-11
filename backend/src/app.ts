import express from "express";
import product from "./routes/productRoute";
import vendor from "./routes/vendorRoute";
const app = express();

app.use(express.json());
app.use("/api/v1/", product);
app.use("/api/v1/", vendor);
export default app;

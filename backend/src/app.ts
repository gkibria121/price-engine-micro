import express from "express";
import product from "./routes/productRoute";
const app = express();

app.use(express.json());
app.use("/api/v1/", product);
export default app;

import { Request, Response } from "express";
import ProductModel from "../models/ProductModel";
import { MongooseError } from "mongoose";

export async function index(req: Request, res: Response) {
  const products = await ProductModel.find();
  res.status(200).send({
    products,
  });
}

export async function createProduct(req: Request, res: Response) {
  const { name } = req.body;
  if (!name) {
    res.status(442).send({ message: "Name is required" });
    return;
  }
  const newProduct = await ProductModel.create({ name });
  res.status(201).send({ product: newProduct });
}

export async function bulkInsertOrUpdate(req: Request, res: Response) {
  const { products } = req.body;
  // Validate input
  if (!Array.isArray(products) || products.length === 0) {
    res.status(442).send({ message: "Missing or invalid fields" });
    return;
  }
  // Insert products in bulk
  try {
    const newProducts = await ProductModel.insertMany(products);
    res.status(201).send({
      message: "Products added or updated successfully",
      products: newProducts,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    if (error instanceof MongooseError)
      res.status(442).send({ message: "Validation failed" });
    res.status(500).send({ message: "Internal server error" });
    return;
  }
}

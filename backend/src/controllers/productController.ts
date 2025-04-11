import { Request, Response } from "express";
import ProductModel from "../models/ProductModel";
import { MongooseError } from "mongoose";
import VendorProductModel from "../models/VendorProductModel";

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

export async function getProduct(req: Request, res: Response) {
  const productId = req.params.id;
  const product = await ProductModel.findOne({
    _id: productId,
  });
  if (!product) {
    res.status(404).send({ message: "Product not found" });
    return;
  }
  res.status(200).send({
    _id: product._id,
    name: product.name,
  });
}

export async function updateProduct(req: Request, res: Response) {
  const productId = req.params.id;
  const { name } = req.body;

  const product = await ProductModel.findOne({
    _id: productId,
  });
  if (!name) {
    res.status(404).send({ message: "Name is not provided!" });
  }
  if (!product) {
    res.status(404).send({ message: "Product not found" });
    return;
  }
  // Update the product
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    product,
    { $set: { name } },
    { new: true, runValidators: true }
  );

  res.status(200).send({
    message: "Product updated successfully",
    product: updatedProduct,
  });
}
export async function deleteProduct(req: Request, res: Response) {
  const productId = req.params.id;
  const product = await ProductModel.findOne({
    _id: productId,
  });
  if (!product) {
    res.status(404).send({ message: "Product not found" });
    return;
  }
  await ProductModel.deleteOne({ _id: productId });
  await VendorProductModel.deleteMany({ product: productId });

  res.status(204).send({
    message: "Product deleted successfully",
  });
}

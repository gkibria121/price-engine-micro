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
    res.status(422).send({ message: "Name is required" });
    return;
  }
  const existingProduct = await ProductModel.findOne({ name: name });
  if (existingProduct) {
    res.status(422).send({ message: "Product already exists." });
    return;
  }
  const newProduct = await ProductModel.create({ name });
  res.status(201).send({ product: newProduct });
}

export async function bulkInsert(req: Request, res: Response) {
  const { products } = req.body;

  // Validate input
  if (!Array.isArray(products) || products.length === 0) {
    res.status(422).send({ message: "Missing or invalid fields" });
    return;
  }
  // 🔍 Check for duplicate names in request body
  const names = products.map((p) => p.name);
  const hasDuplicates = new Set(names).size !== names.length;

  if (hasDuplicates) {
    res
      .status(422)
      .send({ message: "Duplicate product names in request body" });
    return;
  }
  try {
    const insertedProducts = await ProductModel.insertMany(products, {
      ordered: false, // continue on duplicate key error
    });

    res.status(201).send({
      message: "Products added successfully (duplicates skipped)",
      products: insertedProducts,
    });
  } catch (error: any) {
    console.error("❌ Error:", error);

    if (error.name === "BulkWriteError" && error.code === 11000) {
      // Some duplicates occurred, but others were inserted
      res.status(201).send({
        message: "Some products were skipped due to duplicates",
        products: error.insertedDocs || [],
        error: error.message,
      });
      return;
    }
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
    id: product._id,
    name: product.name,
  });
}

export async function updateProduct(req: Request, res: Response) {
  const productId = req.params.id;

  const product = await ProductModel.findOne({
    _id: productId,
  });
  if (!product) {
    res.status(404).send({ message: "Product not found" });
    return;
  }
  const { name } = req.body;
  if (!name) {
    res.status(422).send({ message: "Name is not provided!" });
    return;
  }

  // Update the product
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    product,
    { $set: { name } },
    { new: true, runValidators: true }
  );

  res.status(203).send({
    message: "Product updated successfully",
    product: updatedProduct.toJSON(),
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

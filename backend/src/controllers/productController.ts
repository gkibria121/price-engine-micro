import { Request, Response } from "express";
import ProductModel from "../models/ProductModel";
import VendorProductModel from "../models/VendorProductModel";
import { NotFoundException } from "../Exceptions/NotFoundException";
import "express-async-errors";
import { CustomValidationException } from "../Exceptions/CustomValidationException";
import { MongooseError } from "mongoose";
import ProductCreatedPublisher from "../events/publishers/product-created-publisher";
import ProductUpdatedPublisher from "../events/publishers/product-updated-publisher";
import ProductDeletedPublisher from "../events/publishers/product-deleted-publisher";
import { jetStreamWrapper } from "../lib/jet-stream-client";
export async function index(req: Request, res: Response) {
  const products = await ProductModel.find();
  res.status(200).send({
    products,
  });
}

export async function createProduct(req: Request, res: Response) {
  const { name } = req.body;

  const existingProduct = await ProductModel.findOne({ name: name });
  if (existingProduct) {
    throw new CustomValidationException("Product already exists.", {
      product: ["Product already exists."],
    });
  }
  const newProduct = await ProductModel.create({ name });
  const publisher = new ProductCreatedPublisher(jetStreamWrapper.client);
  publisher.publish(newProduct);
  res.status(201).send({ product: newProduct });
}

export async function bulkInsert(req: Request, res: Response) {
  const { products } = req.body;

  try {
    // Create arrays to store new products and skipped products
    const newProducts = [] as any[];
    const skippedProducts = [] as any[];

    for (const product of products) {
      // Check if the product with the same name already exists in the database
      const existingProduct = await ProductModel.findOne({
        name: product.name,
      });

      if (existingProduct) {
        // Skip duplicates that were previously inserted
        skippedProducts.push(product);
      } else {
        // Add new products to the insertion array
        newProducts.push(product);
      }
    }

    // Insert only the new products into the database (those that don't exist yet)
    const createdProducts = await ProductModel.insertMany(newProducts, {
      ordered: false,
    });
    const publisher = new ProductCreatedPublisher(jetStreamWrapper.client);

    createdProducts.map((newProduct) => {
      publisher.publish(newProduct);
    });

    // Respond with the appropriate message and data
    res.status(201).json({
      message:
        skippedProducts.length > 0
          ? "Some products were skipped due to previously taken names"
          : "All products uploaded successfully",
      products: createdProducts, // Return the successfully inserted products
      skipped: skippedProducts, // Return the skipped products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading products" });
  }
}
export async function getProduct(req: Request, res: Response) {
  const productId = req.params.id;
  const product = await ProductModel.findOne({
    _id: productId,
  });
  if (!product) {
    throw new NotFoundException("Product not found");
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
    throw new NotFoundException("Product not found");
  }
  const { name } = req.body;

  // Update the product
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    product,
    { $set: { name } },
    { new: true, runValidators: true }
  );
  const publisher = new ProductUpdatedPublisher(jetStreamWrapper.client);
  publisher.publish(updatedProduct);
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
    throw new NotFoundException("Product not found");
  }
  await ProductModel.deleteOne({ _id: productId });
  await VendorProductModel.deleteMany({ product: productId });

  const publisher = new ProductDeletedPublisher(jetStreamWrapper.client);

  publisher.publish(product);

  res.status(204).send({
    message: "Product deleted successfully",
  });
}

import { Request, Response } from "express";
import ProductModel from "../models/ProductModel";

export async function index(req: Request, res: Response) {
  const products = await ProductModel.find();
  res.status(200).send({
    products,
  });
}

export async function createProduct(req: Request, res: Response) {
  const { name } = req.body;
  if (!name) {
    return res.status(442).send({ message: "Name is required" });
  }
  const newProduct = await ProductModel.create({ name });
  res.status(201).send({ product: newProduct });
}

import ProductModel from "../models/ProductModel";

export function createProduct() {
  const product = { name: "Product 1" };
  return ProductModel.create(product);
}

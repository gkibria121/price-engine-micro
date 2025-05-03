import { Product } from "@/types";

export async function getProducts() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  if (!response.ok) {
    new Error("Faild to fetch!");
  }
  if (!response.ok) throw new Error("Something went wrong!");
  const data = await response.json();
  const products = data.products as Product[];
  return products;
}

export async function getProduct(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
  );
  if (!response.ok) throw new Error("Something went wrong!");
  const product = (await response.json()) as Product;
  return product;
}

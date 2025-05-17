import { Product } from "@/types";
import { customAxios } from "@/util/fetch";
import { AxiosError } from "axios";

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await customAxios<{ products: Product[] }>(`/products`);

    if (response.status < 200 || response.status >= 300) {
      console.error("Failed to fetch products:", response.status);
      throw new Error("Failed to fetch products!");
    }

    return response.data.products;
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw error;
  }
}

export async function getProduct(id: string): Promise<Product> {
  try {
    const response = await customAxios<Product>(`/products/${id}`);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      throw new Error(error.response.data?.message);
    throw error;
  }
}

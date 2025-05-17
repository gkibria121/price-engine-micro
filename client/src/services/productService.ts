import { Product } from "@/types";
import { customAxios } from "@/util/fetch";

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

    if (response.status < 200 || response.status >= 300) {
      console.error("Failed to fetch product:", response.status);
      throw new Error("Failed to fetch product!");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}

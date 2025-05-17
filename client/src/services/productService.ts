import { Product } from "@/types";
import { customFetch } from "@/util/fetch";

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await customFetch<{ products: Product[] }>(
      `${process.env.NEXT_PUBLIC_API_URL}/products`
    );

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
    const response = await customFetch<Product>(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
    );

    if (response.status < 200 || response.status >= 300) {
      console.error("Failed to fetch product:", response.status);
      throw new Error("Failed to fetch product!");
    }

    return response.data;
  } catch (error) {
    console.error("Error in getProduct:", error);
    throw error;
  }
}

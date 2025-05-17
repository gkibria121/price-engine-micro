import { DeliverySlot, VendorProduct } from "@/types";
import { customAxios } from "@/util/fetch";

export async function getVendorProduct(id: string): Promise<VendorProduct> {
  try {
    const response = await customAxios<{ vendorProduct: VendorProduct }>(
      `/vendor-products/${id}`
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Failed to fetch vendor product!");
    }

    return response.data.vendorProduct;
  } catch (error) {
    console.error("Error in getVendorProduct:", error);
    throw error;
  }
}

export async function getVendorProducts(): Promise<VendorProduct[]> {
  try {
    const response = await customAxios<{ vendorProducts: VendorProduct[] }>(
      `/vendor-products`
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Failed to fetch vendor products!");
    }

    return response.data.vendorProducts;
  } catch (error) {
    console.error("Error in getVendorProducts:", error);
    throw error;
  }
}

export async function getMatchedVendorProducts(
  productId: string,
  deliveryMethod: DeliverySlot
): Promise<VendorProduct[]> {
  try {
    const response = await customAxios<{ vendorProducts: VendorProduct[] }>(
      `/vendor-products/get-matched`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        data: {
          productId,
          deliveryMethod,
        },
      }
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Failed to fetch matched vendor products!");
    }

    return response.data.vendorProducts;
  } catch (error) {
    console.error("Error in getMatchedVendorProducts:", error);
    throw error;
  }
}

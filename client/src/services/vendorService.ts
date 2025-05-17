import { Vendor } from "@/types";
import { customAxios } from "@/util/fetch";

export async function getVendors(): Promise<Vendor[]> {
  try {
    const response = await customAxios<{ vendors: Vendor[] }>(`/vendors`);

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Failed to fetch vendors!");
    }
    return response.data.vendors;
  } catch (error) {
    console.error("Error in getVendors:", error);
    throw error;
  }
}
export async function getVendor(id: string): Promise<Vendor> {
  try {
    const response = await customAxios<{ vendor: Vendor }>(`/vendors/${id}`);

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Failed to fetch vendors!");
    }
    return response.data.vendor;
  } catch (error) {
    console.error("Error in getVendors:", error);
    throw error;
  }
}

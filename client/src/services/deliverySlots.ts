import { DeliverySlot } from "@/types";
import { customFetch } from "@/util/fetch";

export async function getDeliverySlots(productId?: string) {
  try {
    const path = `${process.env.NEXT_PUBLIC_API_URL}/delivery-slots${
      productId ? `/${productId}` : ""
    }`;

    const response = await customFetch(path, {
      // Axios doesn’t support `cache` option like fetch,
      // so if you want no caching, consider adding headers or query params
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Failed to fetch delivery slots!");
    }

    return response.data as DeliverySlot[];
  } catch (error) {
    console.error("Error fetching delivery slots:", error);
    throw error;
  }
}

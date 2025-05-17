import { DeliverySlot } from "@/types";
import { customAxios } from "@/util/fetch";

export async function getDeliverySlots(productId?: string) {
  try {
    const path = `/delivery-slots${productId ? `/${productId}` : ""}`;

    const response = await customAxios(path, {
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

import { PriceCalculationRequest } from "@/types";
import { customAxios } from "@/util/fetch";

export async function calculatePrice(requestBody: PriceCalculationRequest) {
  try {
    const response = await customAxios("/calculate-price-with-vendor", {
      method: "POST",

      data: requestBody,
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Failed to calculate price!");
    }

    return response.data; // Adjust the return type based on API response shape
  } catch (error) {
    console.error("Error in calculatePrice:", error);
    throw error;
  }
}

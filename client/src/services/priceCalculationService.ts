import { PriceCalculationRequest } from "@/types";
import { customAxios } from "@/util/fetch";
import { AxiosError } from "axios";

export async function calculatePrice(requestBody: PriceCalculationRequest) {
  try {
    const response = await customAxios("/calculate-price-with-vendor", {
      method: "POST",

      data: requestBody,
    });

    return response.data; // Adjust the return type based on API response shape
  } catch (error) {
    console.error("Error in calculatePrice:", error);
    if (error instanceof AxiosError)
      throw new Error(error.response.data?.message);
    throw error;
  }
}

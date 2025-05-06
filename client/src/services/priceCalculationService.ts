import { PriceCalculationRequest } from "@/types";

export async function calculatePrice(requestBody: PriceCalculationRequest) {
  return await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/calculate-price-with-vendor`,
    {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

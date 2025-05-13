export async function getDeliverySlots(productId: string = undefined) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/delivery-slots${
      productId ? "/" + productId : ""
    }`,
    {
      cache: "no-store",
    }
  );
  if (!response.ok) throw new Error("Something went wrong!");

  return await response.json();
}

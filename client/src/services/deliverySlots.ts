export async function getDeliverySlots() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/delivery-slots`,
    {
      cache: "no-store",
    }
  );
  if (!response.ok) throw new Error("Something went wrong!");

  return await response.json();
}

import { DeliverySlot, VendorProduct } from "@/types";

export async function getVendorProduct(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/vendor-products/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Something went wrong!");
  }

  const vendorProductData = await response.json();

  const vendorProduct = vendorProductData.vendorProduct as VendorProduct;
  return vendorProduct;
}

export async function getVendorProducts() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/vendor-products`
  );
  if (!response.ok) {
    new Error("Faild to fetch!");
  }

  const data = await response.json();
  const vendorProducts = data.vendorProducts as VendorProduct[];
  return vendorProducts;
}
export async function getMatchedVendorProducts(
  productId: string,
  deliveryMethod: DeliverySlot
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/vendor-products/get-matched`,
    {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        deliveryMethod,
      }),
    }
  );
  if (!response.ok) throw new Error("Something went wrong!");
  const data = await response.json();
  const vendorProducts = data.vendorProducts as VendorProduct[];
  return vendorProducts;
}

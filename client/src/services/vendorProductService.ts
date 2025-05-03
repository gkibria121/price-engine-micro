import { VendorProduct } from "@/types";

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

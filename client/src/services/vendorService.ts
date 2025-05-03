import { Vendor } from "@/types";

export async function getVendors() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Something went wrong!");
  const data = await response.json();
  const vendors = data.vendors as Vendor[];
  return vendors;
}

import React from "react";
import VendorForm from "@/componets/form/VendorForm";
import { PageProps, Vendor } from "@/types";

export default async function page({ params }: PageProps) {
  const { id } = await params;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/vendors/${id}`
  );
  if (!response.ok) throw new Error("Something went wrong!");
  const vendor = (await response.json()).vendor as Vendor;

  return (
    <main>
      <h1 className="pb-2">Edit a Vendor</h1>

      <VendorForm isEdit={true} vendor={vendor} />
    </main>
  );
}

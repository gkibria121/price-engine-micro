import React from "react";
import VendorForm from "@/componets/form/VendorForm";
import { PageProps } from "@/types";
import { getVendor } from "@/services/vendorService";

export default async function page({ params }: PageProps) {
  const { id } = await params;

  const vendor = await getVendor(id);

  return (
    <main>
      <h1 className="pb-2">Edit a Vendor</h1>

      <VendorForm isEdit={true} vendor={vendor} />
    </main>
  );
}

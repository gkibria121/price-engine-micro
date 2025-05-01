"use client";

import VendorProductForm from "@/componets/form-components/VendorProductForm";

export default function AddProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Vendor Product</h1>
      <VendorProductForm
        products={[{ id: "12334", name: "Product 1" }]}
        vendors={[
          {
            id: "1234",
            address: "address 1",
            email: "gkibria121@gmail.com",
            name: "Vendor 1",
            rating: 90,
          },
        ]}
      />
    </div>
  );
}

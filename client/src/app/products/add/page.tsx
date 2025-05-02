import ProductForm from "@/componets/form-components/ProductForm";
import React from "react";

function page() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

      <ProductForm />
    </div>
  );
}

export default page;

import ProductForm from "@/componets/form-components/ProductForm";
import { getProduct } from "@/services/productService";
import React from "react";
type PageProps = {
  params: Promise<{ id: string }>;
};
async function page({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <ProductForm isEdit={true} product={product} />
    </div>
  );
}

export default page;

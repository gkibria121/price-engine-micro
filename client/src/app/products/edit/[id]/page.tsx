import ProductForm from "@/componets/form-components/ProductForm";
import { Product } from "@/types";
import React from "react";
type PageProps = {
  params: { id: string };
};
async function page({ params }: PageProps) {
  const { id } = await params;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
  );
  if (!response.ok) throw new Error("Something went wrong!");
  const product = (await response.json()) as Product;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <ProductForm isEdit={true} product={product} />
    </div>
  );
}

export default page;

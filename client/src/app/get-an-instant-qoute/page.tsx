import ProductOrderFLow from "@/componets/ProductOrderFLow";
import { ProductOrderFlowProvider } from "@/contexts/prodouctOrderFlowContext";
import { getProducts } from "@/services/productService";
import { getVendorProducts } from "@/services/vendorProductService";
import React from "react";

async function page({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const vendorProducts = await getVendorProducts();
  const productName = (await searchParams)["product_type"];
  const defaultVendorProduct = vendorProducts.find(
    (vp) => vp.product.name === productName
  );
  const products = await getProducts();
  return (
    <ProductOrderFlowProvider
      vendorProducts={vendorProducts}
      defaultVendorProduct={defaultVendorProduct}
      products={products}
    >
      <ProductOrderFLow />
    </ProductOrderFlowProvider>
  );
}

export default page;

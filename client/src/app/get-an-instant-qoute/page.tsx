import ProductOrderFLow from "@/componets/ProductOrderFLow";
import { ProductOrderFlowProvider } from "@/contexts/prodouctOrderFlowContext";
import { getVendorProducts } from "@/services/vendorProductService";
import React from "react";

async function page({
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const vendorProducts = await getVendorProducts();
  const productName = (await searchParams)["product_type"];
  const defaultVendorProduct = vendorProducts.find(
    (vp) => vp.product.name === productName
  );
  return (
    <ProductOrderFlowProvider
      vendorProducts={vendorProducts}
      defaultVendorProduct={defaultVendorProduct}
    >
      <ProductOrderFLow />
    </ProductOrderFlowProvider>
  );
}

export default page;

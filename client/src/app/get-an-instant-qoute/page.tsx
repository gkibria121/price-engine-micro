import ProductOrderFLow from "@/componets/ProductOrderFLow";
import { ProductOrderFlowProvider } from "@/contexts/prodouctOrderFlowContext";
import { getVendorProducts } from "@/services/vendorProductService";
import React from "react";

async function page() {
  const vendorProducts = await getVendorProducts();

  return (
    <ProductOrderFlowProvider vendorProducts={vendorProducts}>
      <ProductOrderFLow />
    </ProductOrderFlowProvider>
  );
}

export default page;

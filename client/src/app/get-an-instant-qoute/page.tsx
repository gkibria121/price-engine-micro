import ProductOrderFLow from "@/componets/ProductOrderFLow";
import { ProductOrderFlowProvider } from "@/contexts/prodouctOrderFlowContext";
import React from "react";

function page() {
  return (
    <ProductOrderFlowProvider>
      <ProductOrderFLow />
    </ProductOrderFlowProvider>
  );
}

export default page;

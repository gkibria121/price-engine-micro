// File: contexts/ProductContext.js
"use client";
import { Product, VendorProduct } from "@/types";
import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";
type ProductContextValues = {
  vendorProducts: VendorProduct[];
  products: Product[];
  pricingRuleMetas: VendorProduct["pricingRuleMetas"];
  setPricingRuleMetas: React.Dispatch<
    React.SetStateAction<VendorProduct["pricingRuleMetas"]>
  >;
  setVendorProduct: React.Dispatch<React.SetStateAction<VendorProduct>>;
  vendorProduct: VendorProduct;
};
const ProductContext = createContext<ProductContextValues>(undefined);

export const ProductProvider = ({
  children,
  products,
  vendorProducts,
  defaultVendorProduct,
}: PropsWithChildren & {
  products: Product[];
  vendorProducts: VendorProduct[];
  defaultVendorProduct: VendorProduct;
}) => {
  const [pricingRuleMetas, setPricingRuleMetas] = useState<
    VendorProduct["pricingRuleMetas"]
  >(defaultVendorProduct?.pricingRuleMetas || []);

  const [vendorProduct, setVendorProduct] = useState<
    VendorProduct | undefined
  >();
  return (
    <ProductContext.Provider
      value={{
        vendorProducts,
        products,
        pricingRuleMetas,
        setPricingRuleMetas,
        vendorProduct,
        setVendorProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

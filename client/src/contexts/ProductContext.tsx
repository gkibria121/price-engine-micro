// File: contexts/ProductContext.js
"use client";
import { Product, ProductOrderFlowFormType, VendorProduct } from "@/types";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import { useFormContext, useWatch } from "react-hook-form";
type ProductContextValues = {
  vendorProducts: VendorProduct[];
  products: Product[];
  pricingRuleMetas: VendorProduct["pricingRuleMetas"];
  setPricingRuleMetas: React.Dispatch<
    React.SetStateAction<VendorProduct["pricingRuleMetas"]>
  >;
  isProductLoading: boolean;
  setProductLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [isProductLoading, setProductLoading] = useState(false);
  const [pricingRuleMetas, setPricingRuleMetas] = useState<
    VendorProduct["pricingRuleMetas"]
  >(defaultVendorProduct?.pricingRuleMetas || []);

  const { control, setValue } = useFormContext<ProductOrderFlowFormType>();
  const productId = useWatch({ name: "product", control });

  // show loading screen
  useEffect(() => {
    setProductLoading(true);
    const loadingTimeout = setTimeout(() => {
      setProductLoading(false);
    }, 500);
    return () => clearTimeout(loadingTimeout);
  }, [productId]);

  // set default pricing rules
  useEffect(() => {
    setValue("pricingRules", [
      ...pricingRuleMetas.map((pro) => ({
        attribute: pro.attribute,
        value: pro.values[pro.default],
      })),
    ]);
  }, [productId, pricingRuleMetas, setValue]);

  return (
    <ProductContext.Provider
      value={{
        vendorProducts,
        products,
        pricingRuleMetas,
        setPricingRuleMetas,
        isProductLoading,
        setProductLoading,
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

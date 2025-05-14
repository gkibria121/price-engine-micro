// File: contexts/ProductContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const ProductContext = createContext(undefined);

export const ProductProvider = ({ children, products, vendorProducts, defaultVendorProduct }) => {
  const [isProductLoading, setProductLoading] = useState(false);
  const [pricingRuleMetas, setPricingRuleMetas] = useState(
    defaultVendorProduct?.pricingRuleMetas || []
  );
  
  const { control, setValue } = useFormContext();
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
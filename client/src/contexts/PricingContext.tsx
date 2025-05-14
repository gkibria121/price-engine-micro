// File: contexts/PricingContext.js
"use client";
import { PriceCalculationResultType } from "@/types";
import React, { createContext, useContext, useState } from "react";
type PricingContextValues = {
  priceCalculationResult: PriceCalculationResultType;
  setPriceCalculationResult: React.Dispatch<
    React.SetStateAction<PriceCalculationResultType>
  >;
  isPriceCalculating: boolean;
  setIsPriceCalculating: React.Dispatch<React.SetStateAction<boolean>>;
};
const PricingContext = createContext<PricingContextValues>(undefined);

export const PricingProvider = ({ children }) => {
  const [isPriceCalculating, setIsPriceCalculating] = useState<boolean>(false);
  const [priceCalculationResult, setPriceCalculationResult] =
    useState<PriceCalculationResultType>({
      productName: "",
      quantity: 0,
    });

  return (
    <PricingContext.Provider
      value={{
        priceCalculationResult,
        setPriceCalculationResult,
        isPriceCalculating,
        setIsPriceCalculating,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
};

export const usePricingContext = () => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error("usePricingContext must be used within a PricingProvider");
  }
  return context;
};

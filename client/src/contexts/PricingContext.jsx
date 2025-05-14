// File: contexts/PricingContext.js
"use client";
import React, { createContext, useContext, useState } from "react";

const PricingContext = createContext(undefined);

export const PricingProvider = ({ children }) => {
  const [isPriceCalculating, setIsPriceCalculating] = useState(false);
  const [priceCalculationResult, setPriceCalculationResult] = useState({
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
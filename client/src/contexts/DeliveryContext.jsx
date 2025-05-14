// File: contexts/DeliveryContext.js
"use client";
import React, { createContext, useContext, useState } from "react";

const DeliveryContext = createContext(undefined);

export const DeliveryProvider = ({ children }) => {
  const [deliverySlots, setDeliverySlots] = useState([]);

  return (
    <DeliveryContext.Provider
      value={{
        deliverySlots,
        setDeliverySlots,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDeliveryContext = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error("useDeliveryContext must be used within a DeliveryProvider");
  }
  return context;
};
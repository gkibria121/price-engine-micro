// File: contexts/DeliveryContext.js
"use client";
import { DeliverySlot } from "@/types";
import React, { createContext, useContext, useState } from "react";
type DeliveryContextValue = {
  deliverySlots: DeliverySlot[];
  setDeliverySlots: React.Dispatch<React.SetStateAction<DeliverySlot[]>>;
};

const DeliveryContext = createContext<DeliveryContextValue>(undefined);

export const DeliveryProvider = ({ children }) => {
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([]);

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
    throw new Error(
      "useDeliveryContext must be used within a DeliveryProvider"
    );
  }
  return context;
};

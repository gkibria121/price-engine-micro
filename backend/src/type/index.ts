import { deliverySlotSchem } from "@daynightprint/shared";
import { z } from "zod";
export type DeliverySlot = z.infer<typeof deliverySlotSchem>;

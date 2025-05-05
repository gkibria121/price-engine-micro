import { z } from "zod";

export const ProductOrderFlowFormSchema = z.object({
  product: z.string().min(1, "Minimum one character"),
});

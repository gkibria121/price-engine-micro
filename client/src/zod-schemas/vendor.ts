import { z } from "zod";

export const vendorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
  rating: z.number(),
});

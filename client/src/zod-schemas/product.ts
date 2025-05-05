import { z } from "zod";

export const productSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty("This field is required"),
});

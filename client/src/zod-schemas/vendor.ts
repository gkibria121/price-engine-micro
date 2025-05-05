import { z } from "zod";

export const vendorSchema = z.object({
  id: z.string(), // Assuming 'id' is system-generated or managed elsewhere
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().nonempty("Address is required"),
  rating: z
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .min(0, "Rating must be at least 0")
    .max(100, "Rating cannot exceed 100"),
});

export const vendorFormSchema = z.object({
  vendors: z
    .array(vendorSchema.omit({ id: true }))
    .min(1, "At least one vendor must be provided"),
});

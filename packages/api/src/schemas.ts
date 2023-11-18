import { z } from "zod";

export const productCreationSchema = z.object({
  stock: z.coerce.number().min(0),
  imageUrl: z.string().min(1, { message: "Image must be uploaded" }),
  category: z.string().min(1),
  name: z.string().min(2),
  description: z.string().optional(),
  pricing: z.object({
    visitor: z.coerce.number().min(0),
    customer: z.coerce.number().min(0),
    contractor: z.coerce.number().min(0),
    frequent: z.coerce.number().min(0),
    professional: z.coerce.number().min(0),
    vip: z.coerce.number().min(0),
  }),
});

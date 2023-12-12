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

export const productUpdateSchema = z.object({
  productId: z.string().min(1),
  data: z.object({
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
  }),
});

export const filtersStateSchemaUsers = z.array(
  z.object({
    id: z.enum([
      "group",
      "occupation",
      "purchaseFrequency",
      "businessType",
      "email",
      "fullName",
      "phone",
      "userGroup",
    ]),
    value: z.string().or(z.array(z.string())),
  }),
);
export const sortStateSchemaUsers = z.array(
  z.object({
    id: z.enum(["fullName", "email", "createdAt"]),
    desc: z.boolean(),
  }),
);

export const filtersStateSchemaOrders = z.array(
  z.object({
    id: z.enum(["email", "fullName", "phone"]),
    value: z.string().or(z.array(z.string())),
  }),
);
export const sortStateSchemaOrders = z.array(
  z.object({
    id: z.enum(["fullName", "email", "createdAt", "total"]),
    desc: z.boolean(),
  }),
);

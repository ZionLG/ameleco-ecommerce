import { z } from "zod";

import { BusinessType, Occupation, PurchaseFrequency } from "@ameleco/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.profile.findUnique({ where: { userId: ctx.user.id } });
  }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        companyName: z.string().optional(),
        phone: z.string(),
        additionalInfo: z.string().optional(),
        occupation: z.nativeEnum(Occupation),
        businessType: z.nativeEnum(BusinessType).optional(),
        purchaseFrequency: z.nativeEnum(PurchaseFrequency),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.profile.update({
        where: { userId: ctx.user.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          additionalInformation: input.additionalInfo,
          businessType: input.businessType,
          occupation: input.occupation,
          purchaseFrequency: input.purchaseFrequency,
          phone: input.phone,
          companyName: input.companyName,
        },
      });
    }),
  getSecretMessage: protectedProcedure.query(() => {
    // testing type validation of overridden next-auth Session in @ameleco/auth package
    return "you can see this secret message!";
  }),
});

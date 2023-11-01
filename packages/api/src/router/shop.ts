import type { Groups } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const shopRouter = createTRPCRouter({
  productById: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      let group;

      if (ctx.user) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { data, error } = await ctx.supabase.rpc("get_my_claim", {
          claim: "AMELECO_group",
        });
        if (error) {
          return;
        }

        group = data as Groups;
      } else {
        group = "VISITOR" as Groups;
      }

      return ctx.prisma.product.findUnique({
        where: { id: input.productId },
        include: {
          price: {
            select: {
              contractor: group === "CONTRACTOR",
              customer: group === "CUSTOMER",
              frequent: group === "FREQUENT",
              professional: group === "PROFESSIONAL",
              vip: group === "VIP",
              visitor: group === "VISITOR",
            },
          },
        },
      });
    }),
  allProducts: publicProcedure.query(async ({ ctx }) => {
    let group;

    if (ctx.user) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { data, error } = await ctx.supabase.rpc("get_my_claim", {
        claim: "AMELECO_group",
      });
      if (error) {
        return;
      }

      group = data as Groups;
    } else {
      group = "VISITOR" as Groups;
    }
    return ctx.prisma.product.findMany({
      include: {
        price: {
          select: {
            contractor: group === "CONTRACTOR",
            customer: group === "CUSTOMER",
            frequent: group === "FREQUENT",
            professional: group === "PROFESSIONAL",
            vip: group === "VIP",
            visitor: group === "VISITOR",
          },
        },
      },
    });
  }),
});

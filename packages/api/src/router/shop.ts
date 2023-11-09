import type { Groups } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const shopRouter = createTRPCRouter({
  createCart: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.cart.create({
      data: { userId: ctx.user.id },
    });
  }),
  getProduct: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input, ctx }) => {
      let group;

      if (ctx.user && ctx.supabase) {
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
      const cartItem = await ctx.prisma.product.findUnique({
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

      return cartItem;
    }),
  getCartItem: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .query(async ({ input, ctx }) => {
      const cartItem = await ctx.prisma.cartItem.findUnique({
        where: { id: input.itemId },
        include: { product: true },
      });

      return cartItem;
    }),
  getCart: protectedProcedure.query(async ({ ctx }) => {
    let group;

    if (ctx.user && ctx.supabase) {
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
    return await ctx.prisma.cart.findUnique({
      where: { userId: ctx.user.id },
      select: {
        id: true,
        items: {
          orderBy: {
            createdAt: "asc",
          },
          select: {
            quantity: true,
            id: true,

            product: {
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
            },
          },
        },
      },
    });
  }),
  addToCart: protectedProcedure
    .input(
      z.object({ productId: z.string(), productQuantity: z.number().min(1) }),
    )
    .mutation(async ({ input: { productId, productQuantity }, ctx }) => {
      const item = await ctx.prisma.product.findUnique({
        where: { id: productId },
      });

      if (item == null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found.",
        });
      }

      const curStock = item.stock;

      if (productQuantity > curStock) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Insufficient stock. Please refresh for updates.",
        });
      }

      const cart = await ctx.prisma.cart.findUnique({
        where: { userId: ctx.user.id },
        select: { id: true, items: true },
      });
      if (cart == null) {
        const createdCart = await ctx.prisma.cart.create({
          data: { userId: ctx.user.id },
        });

        return await ctx.prisma.cartItem.create({
          data: {
            quantity: productQuantity,
            productId: productId,
            cartId: createdCart.id,
          },
        });
      } else {
        const itemInCart = cart.items.find(
          (item) => item.productId === productId,
        );

        if (itemInCart) {
          const requestedStock = itemInCart.quantity + productQuantity;

          if (requestedStock > curStock) {
            throw new TRPCError({
              code: "UNPROCESSABLE_CONTENT",
              message: "Insufficient stock. Please refresh for updates.",
            });
          }

          return await ctx.prisma.cartItem.update({
            where: { id: itemInCart.id },
            data: { quantity: { increment: productQuantity } },
          });
        }

        return await ctx.prisma.cartItem.create({
          data: {
            quantity: productQuantity,
            productId: productId,
            cartId: cart.id,
          },
        });
      }
    }),
  changeItemQuantity: protectedProcedure
    .input(z.object({ itemId: z.string(), productQuantity: z.number().min(1) }))
    .mutation(async ({ input: { itemId, productQuantity }, ctx }) => {
      const item = await ctx.prisma.cartItem.findUnique({
        where: { id: itemId },
        select: {
          product: {
            select: {
              stock: true,
            },
          },
        },
      });

      if (item == null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found.",
        });
      }

      if (productQuantity > item.product.stock) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Insufficient stock. Please refresh for updates.",
        });
      }

      const updatedItem = await ctx.prisma.cartItem.update({
        where: { id: itemId },

        data: { quantity: productQuantity },
      });

      return updatedItem;
    }),
  removeFromCart: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ input: { itemId }, ctx }) => {
      const item = await ctx.prisma.cartItem.delete({
        where: { id: itemId },
      });

      if (item == null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found.",
        });
      }

      return item;
    }),
  productById: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      let group;

      if (ctx.user && ctx.supabase) {
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

  productByName: publicProcedure
    .input(z.object({ productName: z.string() }))
    .query(async ({ ctx, input }) => {
      let group;

      if (ctx.user && ctx.supabase) {
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
        where: { name: input.productName },
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

    if (ctx.user && ctx.supabase) {
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

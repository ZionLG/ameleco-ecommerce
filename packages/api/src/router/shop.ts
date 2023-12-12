import type { Groups } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";
import { z } from "zod";

import {
  filtersStateSchemaOrders,
  productCreationSchema,
  productUpdateSchema,
  sortStateSchemaOrders,
} from "../schemas";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  staffProcedure,
} from "../trpc";

export const shopRouter = createTRPCRouter({
  createCart: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.cart.create({
      data: { userId: ctx.user.id },
    });
  }),
  createPaymentLink: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.stripe === null || ctx.req === null) {
      return;
    }
    let group = "VISITOR" as Groups;
    console.log(ctx.req.headers.host);
    if (ctx.user) {
      group = ctx.user.app_metadata.AMELECO_group as Groups;
    } else {
      group = "VISITOR" as Groups;
    }

    // TODO - check quantity

    const cart = await ctx.prisma.cart.findUnique({
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
                price: true,
              },
            },
          },
        },
      },
    });

    if (cart)
      await Promise.all(
        cart.items.map(async (item) => {
          if (item.quantity > item.product.stock) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Product is not in stock.",
            });
          } else {
            await ctx.prisma.product.update({
              data: { stock: item.product.stock - item.quantity },
              where: { id: item.product.id },
            });
          }
        }),
      );

    const line_items = [] as Stripe.PaymentLinkCreateParams.LineItem[];

    const promises = (cart?.items ?? []).map(async (item) => {
      const price = await ctx.stripe!.prices.create({
        currency: "CAD",
        product: item.product.id,
        unit_amount:
          item.product.price[group.toLowerCase() as Lowercase<Groups>] * 100,
      });
      return { price: price.id, quantity: item.quantity };
    });
    const resolvedPrices = await Promise.all(promises);

    line_items.push(...resolvedPrices);
    const protocol = ctx.req.headers.host?.includes("localhost")
      ? "http"
      : "https";
    const paymentLink = await ctx.stripe.checkout.sessions.create({
      line_items: line_items,
      invoice_creation: {
        enabled: true,
      },
      customer: `cus_${ctx.user.id}`,
      mode: "payment",
      billing_address_collection: "required",
      success_url: `${protocol}://${ctx.req.headers.host}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${protocol}://${ctx.req.headers.host}/cart`,
      expires_at: Math.floor(Date.now() / 1000) + 3600 * 2,
    });
    console.log("URL", paymentLink.url);
    return paymentLink.url;
  }),
  getProduct: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input, ctx }) => {
      let group;

      if (ctx.user) {
        group = ctx.user.app_metadata.AMELECO_group as Groups;
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
  getCheckoutSession: protectedProcedure
    .input(z.object({ session_id: z.string() }))
    .query(async ({ input, ctx }) => {
      if (ctx.stripe === null) {
        return;
      }
      const checkoutSession = await ctx.stripe.checkout.sessions.retrieve(
        input.session_id,
        { expand: ["line_items"] },
      );

      if (checkoutSession.customer !== `cus_${ctx.user.id}`) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Session is not yours.",
        });
      }
      const items = [] as {
        name: string;
        unit_amount: number;
        quantity: number;
      }[];
      if (checkoutSession.line_items)
        checkoutSession.line_items.data.forEach((item) => {
          items.push({
            name: item.description,
            unit_amount: (item.price?.unit_amount ?? 0) / 100,
            quantity: item.quantity ?? 0,
          });
        });
      return {
        products: items,
        total: (checkoutSession.amount_total ?? 0) / 100,
        sessionCreationDate: checkoutSession.created,
      };
      // if (checkoutSession && checkoutSession.line_items) {
      //   const items = [];
      //   const has_more = checkoutSession.line_items.has_more;
      //   const cur_items = checkoutSession.line_items.data;
      //   cur_items.forEach((item) => {
      //     items.push(item);
      //   });
      //   while (has_more) {
      //     const newItems = ctx.stripe.checkout.sessions.listLineItems(
      //       input.session_id,
      //       { starting_after: cur_items[-1].},
      //     );
      //     cur_items.forEach((item) => {
      //       items.push(item);
      //     });
      //   }
      //   console.log(checkoutSession);
      //   return {
      //     products: checkoutSession.line_items,
      //     total: (checkoutSession.amount_total ?? 0) / 100,
      //   };
      // }
    }),
  getOrders: staffProcedure
    .input(
      z.object({
        take: z.number().min(1).max(100),
        skip: z.number().min(0).max(100),
        sort: sortStateSchemaOrders,
        filter: filtersStateSchemaOrders,
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log(input);
      if (ctx.stripe == null) return;
      let orderByObject: object | object[] | undefined;
      if (input.sort[0]) {
        const sortObject = input.sort[0];
        if (sortObject.id === "fullName") {
          orderByObject = {
            user: [
              { firstName: sortObject.desc ? "desc" : "asc" },
              { lastName: sortObject.desc ? "desc" : "asc" },
            ],
          };
        } else if (sortObject.id === "email") {
          orderByObject = {
            user: {
              [sortObject.id]: sortObject.desc ? "desc" : "asc",
            },
          };
        } else {
          orderByObject = {
            [sortObject.id]: sortObject.desc ? "desc" : "asc",
          };
        }
      }
      console.log("orderByObject is", orderByObject);
      const whereObject = {} as {
        email?: {
          contains: string;
        };
        phone?: {
          contains: string;
        };
        firstName?: {
          contains: string;
        };
        lastName?: {
          contains: string;
        };
        OR?: (
          | { firstName: { contains: string } }
          | { lastName: { contains: string } }
        )[];
      };
      input.filter.forEach((obj) => {
        const { id, value } = obj;

        // Check if the object has a "value" field
        if (value) {
          // Check the "id" field and construct the where object accordingly
          if (id === "email" || id === "phone") {
            whereObject[id] = { contains: value as string };
          } else if (id === "fullName") {
            // Split fullName into firstName and lastName
            const [firstName, lastName] = (value as string).split(" ");
            if (lastName && firstName) {
              whereObject.firstName = { contains: firstName };
              whereObject.lastName = { contains: lastName };
            } else if (firstName) {
              // if only firstName is defined, check both first and last name for the input
              whereObject.OR = [
                { firstName: { contains: firstName } },
                { lastName: { contains: firstName } },
              ];
            }
          }
        }
      });
      console.log(whereObject);
      const [data, count] = await ctx.prisma.$transaction([
        ctx.prisma.order.findMany({
          take: input.take,
          skip: input.skip == 0 ? undefined : input.skip,
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                userId: true,
                phone: true,
              },
            },
          },
          where: {
            user: whereObject as object,
          },
          orderBy: orderByObject,
        }),
        ctx.prisma.order.count(),
      ]);
      const newDataArray = await Promise.all(
        data.map(async (order) => {
          // Assuming profile.userId is the Supabase user ID
          const supabaseUser = await ctx.supabase?.auth.admin.getUserById(
            order.userId,
          );
          // Extract app_metadata from Supabase user
          const appMetadata = supabaseUser!.data.user!.app_metadata;

          // Get Stripe data
          const session = await ctx.stripe!.checkout.sessions.retrieve(
            order.sessionId,
          );
          const payment = await ctx.stripe!.paymentIntents.retrieve(
            order.paymentId,
          );

          const invoice = order.invoiceId
            ? await ctx.stripe!.invoices.retrieve(order.invoiceId)
            : null;

          console.log(session);
          console.log(payment);
          console.log(invoice);

          // Combine profile data with app_metadata
          const combinedData = {
            ...order,
            address: session.customer_details?.address,
            total: session.amount_total, // in cents
            payment_status: session.payment_status,
            hosted_invoice_url: invoice ? invoice.hosted_invoice_url : null,
            invoice_pdf: invoice ? invoice.invoice_pdf : null,
            appMetadata: {
              AMELECO_group: appMetadata.AMELECO_group as Groups,
              AMELECO_is_staff: appMetadata.AMELECO_is_staff as boolean,
            },
          };

          return combinedData;
        }),
      );
      console.log("USERS COUNT", count);
      return {
        data: newDataArray,
        count,
      };
    }),
  getCartItem: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .query(async ({ input, ctx }) => {
      // Check if stock is updated

      const cartItem = await ctx.prisma.cartItem.findUnique({
        where: { id: input.itemId },
        include: { product: true },
      });

      return cartItem;
    }),
  getCart: protectedProcedure.query(async ({ ctx }) => {
    let group;

    if (ctx.user) {
      group = ctx.user.app_metadata.AMELECO_group as Groups;
    } else {
      group = "VISITOR" as Groups;
    }

    const cart = await ctx.prisma.cart.findUnique({
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
    // Check if stock is updated

    if (cart) {
      return cart;
    }
    const newCart = ctx.prisma.cart.create({
      data: { userId: ctx.user.id },
      include: {
        items: { include: { product: { include: { price: true } } } },
      },
    });

    return newCart;
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
  getCategories: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
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
  removeProduct: staffProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ input: { productId }, ctx }) => {
      const item = await ctx.prisma.product.delete({
        where: { id: productId },
      });

      if (item == null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found.",
        });
      } else {
        await ctx.stripe?.products.del(productId);
      }

      return item;
    }),
  productById: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      let group;

      if (ctx.user) {
        group = ctx.user.app_metadata.AMELECO_group as Groups;
      } else {
        group = "VISITOR" as Groups;
      }

      return ctx.prisma.product.findUnique({
        where: { id: input.productId },
        include: {
          category: true,

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

      if (ctx.user) {
        group = ctx.user.app_metadata.AMELECO_group as Groups;
      } else {
        group = "VISITOR" as Groups;
      }

      if (ctx.user?.app_metadata.AMELECO_is_staff) {
        return ctx.prisma.product.findUnique({
          where: { name: input.productName },
          include: {
            category: true,
            price: {
              select: {
                visitor: true,
                customer: true,
                frequent: true,
                contractor: true,
                professional: true,
                vip: true,
              },
            },
          },
        });
      }

      return ctx.prisma.product.findUnique({
        where: { name: input.productName },
        include: {
          category: true,
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
      group = ctx.user.app_metadata.AMELECO_group as Groups;
    } else {
      group = "VISITOR" as Groups;
    }
    return ctx.prisma.product.findMany({
      include: {
        category: true,
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
  addProduct: staffProcedure
    .input(productCreationSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.stripe == null) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe server error.",
        });
      }

      const category = await ctx.prisma.category.findUnique({
        where: { name: input.category },
      });

      if (category == null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found.",
        });
      }
      const { pricing: pricingInput } = input;
      const pricing = await ctx.prisma.pricing.create({
        data: {
          contractor: pricingInput.contractor,
          customer: pricingInput.customer,
          frequent: pricingInput.frequent,
          professional: pricingInput.professional,
          vip: pricingInput.vip,
          visitor: pricingInput.visitor,
        },
      });

      const product = await ctx.prisma.product.create({
        data: {
          imageUrl: input.imageUrl,
          stock: input.stock,
          categoryId: category.id,
          name: input.name,
          description: input.description,
          priceId: pricing.id,
        },
      });

      await ctx.stripe.products.create({
        id: product.id,
        name: input.name,
        images: [input.imageUrl],
        shippable: true,
        type: "good",
        metadata: { category: category.name },
      });

      return product;
    }),
  updateProduct: staffProcedure
    .input(productUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.stripe == null) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe server error.",
        });
      }

      const category = await ctx.prisma.category.findUnique({
        where: { name: input.data.category },
      });

      if (category == null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found.",
        });
      }

      const product = await ctx.prisma.product.update({
        where: {
          id: input.productId,
        },
        data: {
          imageUrl: input.data.imageUrl,
          stock: input.data.stock,
          categoryId: category.id,
          name: input.data.name,
          description: input.data.description,
        },
      });
      const { pricing: pricingInput } = input.data;

      await ctx.prisma.pricing.update({
        where: {
          id: product.priceId,
        },
        data: {
          contractor: pricingInput.contractor,
          customer: pricingInput.customer,
          frequent: pricingInput.frequent,
          professional: pricingInput.professional,
          vip: pricingInput.vip,
          visitor: pricingInput.visitor,
        },
      });

      await ctx.stripe.products.update(product.id, {
        name: input.data.name,
        images: [input.data.imageUrl],
        shippable: true,
        metadata: { category: category.name },
      });

      return product;
    }),
  addCategory: staffProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.category.create({
        data: { name: input.name },
      });
    }),
});

import { z } from "zod";

import type { Groups } from "@ameleco/db";
import { BusinessType, Occupation, PurchaseFrequency } from "@ameleco/db";

import { filtersStateSchema, sortStateSchema } from "../schemas";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  staffProcedure,
} from "../trpc";

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
  getUsers: staffProcedure
    .input(
      z.object({
        take: z.number().min(1).max(100),
        skip: z.number().min(0).max(100),
        sort: sortStateSchema,
        filter: filtersStateSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log(input);
      let orderByObject: object | object[] | undefined;
      if (input.sort[0]) {
        const sortObject = input.sort[0];
        if (sortObject.id === "fullName") {
          orderByObject = [
            { firstName: sortObject.desc ? "desc" : "asc" },
            { lastName: sortObject.desc ? "desc" : "asc" },
          ];
        } else {
          orderByObject = {
            [sortObject.id]: sortObject.desc ? "desc" : "asc",
          };
        }
      }
      console.log("orderByObject is", orderByObject);
      const whereObject = {} as {
        occupation?: {
          in: string[];
        };
        purchaseFrequency?: {
          in: string[];
        };
        userGroup?: {
          in: string[];
        };
        businessType?: {
          in: string[];
        };
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
          if (
            id === "purchaseFrequency" ||
            id === "businessType" ||
            id === "userGroup" ||
            id === "occupation"
          ) {
            whereObject[id] = { in: value as string[] };
          } else if (id === "email" || id === "phone") {
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
        ctx.prisma.profile.findMany({
          take: input.take,
          skip: input.skip == 0 ? undefined : input.skip,
          select: {
            firstName: true,
            lastName: true,
            email: true,
            userId: true,
            companyName: true,
            phone: true,
            createdAt: true,
            purchaseFrequency: true,
            businessType: true,
            occupation: true,
            additionalInformation: true,
          },
          where: whereObject as object,
          orderBy: orderByObject,
        }),
        ctx.prisma.profile.count(),
      ]);
      const newDataArray = await Promise.all(
        data.map(async (profile) => {
          // Assuming profile.userId is the Supabase user ID
          const supabaseUser = await ctx.supabase?.auth.admin.getUserById(
            profile.userId,
          );
          // Extract app_metadata from Supabase user
          const appMetadata = supabaseUser!.data.user!.app_metadata;

          // Combine profile data with app_metadata
          const combinedData = {
            ...profile,
            appMetadata: {
              AMELECO_group: appMetadata.AMELECO_group as Groups,
              AMELECO_is_staff: appMetadata.AMELECO_is_staff as boolean,
            },
          };

          return combinedData;
        }),
      );
      //console.log("USERS", newDataArray);
      return {
        data: newDataArray,
        count,
      };
    }),
});

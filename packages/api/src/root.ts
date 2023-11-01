import { authRouter } from "./router/auth";
import { shopRouter } from "./router/shop";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  shop: shopRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { createRouter } from "@/utils/router";

import { productsRouter } from "./routers/products";
import { userRouter } from "./routers/users";
import { wishlistRouter } from "./routers/wishlists";

export const appRouter = createRouter()
  .merge("user.", userRouter)
  .merge("wishlists.", wishlistRouter)
  .merge("products.", productsRouter);

export type AppRouter = typeof appRouter;

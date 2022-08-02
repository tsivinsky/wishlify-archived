import { createRouter } from "@/utils/router";

import { userRouter } from "./routers/users";
import { wishlistRouter } from "./routers/wishlists";

export const appRouter = createRouter()
  .merge("user.", userRouter)
  .merge("wishlists.", wishlistRouter);

export type AppRouter = typeof appRouter;

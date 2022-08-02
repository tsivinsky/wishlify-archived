import { userRouter } from "./routers/users";
import { createRouter } from "./routers/utils";
import { wishlistRouter } from "./routers/wishlists";

export const appRouter = createRouter().merge(userRouter).merge(wishlistRouter);

export type AppRouter = typeof appRouter;

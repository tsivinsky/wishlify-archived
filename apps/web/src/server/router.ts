import * as trpc from "@trpc/server";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { Context } from "./context";

export const appRouter = trpc.router<Context>().mutation("update-username", {
  input: z.object({
    username: z.string(),
  }),
  async resolve({ input, ctx }) {
    const { req, res, prisma } = ctx;

    const usernameTaken = await prisma.user.findFirst({
      where: { username: input.username },
    });

    if (usernameTaken) {
      throw new trpc.TRPCError({
        code: "BAD_REQUEST",
        message: "Username already taken",
      });
    }

    const session = await unstable_getServerSession(req, res, authOptions);
    const user = await prisma.user.findFirst({
      where: { email: session?.user?.email },
    });

    // TODO: save user id in session and remove getting user from database here

    const updatedUser = await prisma.user.update({
      data: { username: input.username },
      where: { id: user?.id },
    });

    return {
      user: updatedUser,
    };
  },
});

export type AppRouter = typeof appRouter;

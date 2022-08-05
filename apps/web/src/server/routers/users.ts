import * as trpc from "@trpc/server";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";

import { createRouter } from "@/utils/router";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const userRouter = createRouter()
  .query("findByUsername", {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: { username: input.username },
      });
      if (!user) {
        return null;
      }

      return user;
    },
  })
  .mutation("update-username", {
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

      const updatedUser = await prisma.user.update({
        data: { username: input.username },
        where: { id: session?.user?.id },
      });

      return {
        user: updatedUser,
      };
    },
  });

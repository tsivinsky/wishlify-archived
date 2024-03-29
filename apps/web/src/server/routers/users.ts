import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createRouter } from "@/utils/router";

export const userRouter = createRouter()
  .query("findByUsername", {
    input: z.object({
      username: z.string().nullable(),
    }),
    async resolve({ ctx, input }) {
      if (!input.username) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { username: input.username },
      });
      if (!user) {
        return null;
      }

      return user;
    },
  })
  .mutation("update", {
    input: z.object({
      username: z.string().nullish().optional(),
      avatar: z.string().nullish().optional(),
    }),
    async resolve({ ctx, input }) {
      const { username, avatar } = input;

      const newData: Partial<User> = {};

      if (username && ctx.session?.user.username !== username) {
        const usernameTaken = await ctx.prisma.user.findFirst({
          where: { username },
        });
        if (usernameTaken) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Такой username уже занят",
          });
        }

        newData.username = username;
      }

      if (avatar && ctx.session?.user.avatar !== avatar) {
        newData.avatar = avatar;
      }

      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session?.user.id },
        data: newData,
      });

      if (ctx.session) {
        ctx.session.user.username = updatedUser.username;
        ctx.session.user.avatar = updatedUser.avatar;
      }

      return updatedUser;
    },
  })
  .mutation("delete", {
    async resolve({ ctx }) {
      const deleteWishlists = ctx.prisma.wishlist.deleteMany({
        where: { userId: ctx.session?.user.id },
      });
      const deleteUser = ctx.prisma.user.delete({
        where: { id: ctx.session?.user.id },
      });

      await ctx.prisma.$transaction([deleteWishlists, deleteUser]);
    },
  });

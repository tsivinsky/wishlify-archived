import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { parseWishlistName } from "@/utils/parseWishlistName";
import { createRouter } from "@/utils/router";

export const wishlistRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session && ctx.req.method !== "GET") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication is required here",
      });
    }

    return next();
  })
  .query("get-all", {
    async resolve({ ctx }) {
      const wishlists = await ctx.prisma.wishlist.findMany({
        where: { userId: ctx.session?.user.id },
      });

      return wishlists;
    },
  })
  .query("findByOwner", {
    input: z.object({
      userId: z.string(),
      includePrivate: z.boolean().optional().default(false),
    }),
    async resolve({ ctx, input }) {
      const wishlists = await ctx.prisma.wishlist.findMany({
        where: {
          userId: input.userId,
          private: input.includePrivate ? undefined : false,
        },
      });

      return wishlists;
    },
  })
  .query("findByDisplayName", {
    input: z.object({
      displayName: z.string(),
    }),
    async resolve({ ctx, input }) {
      const wishlist = await ctx.prisma.wishlist.findFirst({
        where: { displayName: input.displayName },
      });

      if (!wishlist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Wishlist not found",
        });
      }

      return wishlist;
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string(),
      private: z.boolean().optional().default(false),
    }),
    async resolve({ ctx, input }) {
      const displayName = parseWishlistName(input.name);

      const wishlist = await ctx.prisma.wishlist.create({
        data: {
          name: input.name,
          displayName,
          userId: ctx.session!.user.id,
          private: input.private,
        },
        include: { user: true },
      });

      return wishlist;
    },
  })
  .mutation("delete", {
    input: z.object({
      wishlists: z.array(z.string()),
    }),
    async resolve({ ctx, input }) {
      try {
        const deletedWishlists = await ctx.prisma.wishlist.deleteMany({
          where: { id: { in: input.wishlists } },
        });
        return deletedWishlists;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: String(err),
        });
      }
    },
  });

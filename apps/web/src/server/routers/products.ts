import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createRouter } from "@/utils/router";

export const productsRouter = createRouter().mutation("add-to-wishlist", {
  input: z.object({
    wishlistId: z.string(),
    title: z.string(),
    image: z.string().nullish(),
  }),
  async resolve({ ctx, input }) {
    const { wishlistId, title, image } = input;

    const wishlist = await ctx.prisma.wishlist.findUnique({
      where: { id: wishlistId },
    });
    if (!wishlist) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Вишлист не найден",
      });
    }

    const product = await ctx.prisma.product.create({
      data: { title, image, wishlistId: wishlist.id },
    });

    return product;
  },
});

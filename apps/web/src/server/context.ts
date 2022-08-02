import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession } from "next-auth";

import { prisma } from "@/utils/prisma";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function createContext(ctx: trpcNext.CreateNextContextOptions) {
  const { req, res } = ctx;

  const session = await unstable_getServerSession(req, res, authOptions);

  return {
    req,
    res,
    prisma,
    session,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

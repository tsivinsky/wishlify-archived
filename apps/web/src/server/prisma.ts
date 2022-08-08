import { PrismaClient } from "@prisma/client";

import { s3Config } from "@/utils/s3";

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient = prismaGlobal.prisma || new PrismaClient();

prisma.$use(async (params, next) => {
  const result = await next(params);

  if (
    params.model === "User" &&
    ["findFirst", "findUnique"].includes(params.action) &&
    result?.avatar &&
    !result.avatar.startsWith(s3Config.url)
  ) {
    result.avatar = `${s3Config.url}/${result.avatar}`;
  }

  return result;
});

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.prisma = prisma;
}

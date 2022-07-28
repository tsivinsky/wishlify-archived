import { NextApiHandler } from "next";

import { PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

const supportedMethods = ["PATCH"];

const userApi: NextApiHandler = async (req, res) => {
  if (!supportedMethods.includes(req.method ?? "")) {
    return res.status(405).end();
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).end();
  }

  const { email } = session.user;

  let user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return res.status(404).end();
  }

  if (req.method === "PATCH") {
    const { username } = JSON.parse(req.body);

    user = await prisma.user.update({
      data: { username },
      where: { id: user.id },
    });
  }

  res.json(user);
};

export default userApi;

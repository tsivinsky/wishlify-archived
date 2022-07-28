import { NextApiHandler } from "next";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checkUsernameApi: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { username } = JSON.parse(req.body);

  const usernameTaken = await prisma.user.findFirst({ where: { username } });

  if (usernameTaken) {
    return res.json({ ok: false });
  }

  return res.json({ ok: true });
};

export default checkUsernameApi;

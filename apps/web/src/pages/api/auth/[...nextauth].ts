import { prisma } from "@/server/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import EmailProvider from "next-auth/providers/email";

import { s3Config } from "@/utils/s3";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER,
        port: 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      from: `Wishlify <${process.env.EMAIL_USER}>`,
      name: "Email",
    }),
  ],
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify",
    newUser: "/auth/new-user",
  },
  callbacks: {
    async redirect({ baseUrl, url }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      const uri = new URL(url);

      if (uri.origin === baseUrl) {
        const callbackUrl = uri.searchParams.get("callbackUrl");
        if (callbackUrl) {
          return callbackUrl;
        }

        return url;
      }

      return baseUrl;
    },
    async session({ session, user }) {
      const userInDb = await prisma.user.findFirst({ where: { id: user.id } });
      if (!userInDb) return session;

      return {
        ...session,
        user: {
          id: user.id,
          username: userInDb.username,
          email: userInDb.email,
          emailVerified: userInDb.emailVerified?.toISOString() || null,
          avatar: userInDb.avatar,
        },
      };
    },
  },
};

export default NextAuth(authOptions);

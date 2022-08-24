import { unstable_getServerSession } from "next-auth";

export const getServerSession: typeof unstable_getServerSession = async (
  ...args
) => await unstable_getServerSession(...args);

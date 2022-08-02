import { Context } from "@/server/context";
import * as trpc from "@trpc/server";

export const createRouter = () => trpc.router<Context>();

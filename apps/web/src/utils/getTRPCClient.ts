import { AppRouter } from "@/server/router";
import { createTRPCClient } from "@trpc/client";

import { getAppUrl } from "./getAppUrl";

export const getTRPCClient = () => {
  const client = createTRPCClient<AppRouter>({
    url: getAppUrl(),
  });

  return client;
};

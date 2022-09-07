import { AppRouter } from "@/server/router";
import { createTRPCClient } from "@trpc/client";

import { getTRPCUrl } from "./getTRPCUrl";

export const getTRPCClient = () => {
  const client = createTRPCClient<AppRouter>({
    url: getTRPCUrl(),
  });

  return client;
};

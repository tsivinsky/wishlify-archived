import { useEffect } from "react";

import { RouterEvent, useRouter } from "next/router";

export const useRouterEvent = (
  event: RouterEvent,
  callback: () => void,
  condition: boolean = true
) => {
  const router = useRouter();

  useEffect(() => {
    if (condition) {
      router.events.on(event, callback);
    }

    return () => {
      if (condition) {
        router.events.off(event, callback);
      }
    };
  }, [router.events, event, callback, condition]);
};

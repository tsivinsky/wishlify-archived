import React, { useEffect, useState } from "react";

import { AppProps } from "next/app";
import Head from "next/head";

import { Theme, useTheme } from "@wishlify/lib";

import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { withTRPC } from "@trpc/next";
import { SessionProvider } from "next-auth/react";
import { ConfirmContextProvider } from "use-confirm";

import { getAppUrl } from "@/utils/getAppUrl";

import { ConfirmDialog } from "@/components/ConfirmDialog";

import { Page } from "@/types/Page";

import "@/styles/app.css";

type WishlifyAppProps = AppProps & {
  Component: Page;
  pageProps: {
    dehydratedState: DehydratedState;
    [key: string]: any;
  };
};

function WishlifyApp({ Component, pageProps }: WishlifyAppProps) {
  const Layout = Component.layout ?? React.Fragment;
  const getLayout = Component.getLayout ?? ((page) => page);

  const { setTheme } = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    const theme =
      savedTheme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setTheme(theme as Theme);
  }, [setTheme]);

  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Head>
            <title>Wishlify</title>
          </Head>
          <ConfirmContextProvider buttonsText={{ yes: "Да", no: "Нет" }}>
            <ConfirmDialog />
            <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
          </ConfirmContextProvider>
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default withTRPC({
  config() {
    const url = getAppUrl();

    return {
      url,
    };
  },
  ssr: true,
})(WishlifyApp);

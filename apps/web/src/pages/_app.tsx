import React, { useEffect, useState } from "react";

import { AppProps } from "next/app";
import Head from "next/head";

import { useTheme } from "@wishlify/lib";

import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { withTRPC } from "@trpc/next";
import { SessionProvider } from "next-auth/react";

import { getAppUrl } from "@/utils/getAppUrl";

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
    const savedTheme = localStorage.getItem("theme") ?? null;

    const theme =
      savedTheme ?? document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";

    setTheme(theme);
  }, [setTheme]);

  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Head>
            <title>Wishlify</title>
          </Head>
          <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
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

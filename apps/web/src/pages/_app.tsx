import React, { useState } from "react";

import { AppProps } from "next/app";

import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

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

  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default WishlifyApp;

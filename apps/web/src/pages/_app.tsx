import React from "react";

import { AppProps } from "next/app";

import { SessionProvider } from "next-auth/react";

import { Page } from "@/types/Page";

import "@/styles/app.css";

type WishlifyAppProps = AppProps & {
  Component: Page;
};

function WishlifyApp({ Component, pageProps }: WishlifyAppProps) {
  const Layout = Component.layout ?? React.Fragment;
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={pageProps.session}>
      <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
    </SessionProvider>
  );
}

export default WishlifyApp;

import React from "react";

import { AppProps } from "next/app";

import { Page } from "@/types/Page";

import "@/styles/app.css";

type WishlifyAppProps = AppProps & {
  Component: Page;
};

function WishlifyApp({ Component, pageProps }: WishlifyAppProps) {
  const Layout = Component.layout ?? React.Fragment;
  const getLayout = Component.getLayout ?? ((page) => page);

  return <Layout>{getLayout(<Component {...pageProps} />)}</Layout>;
}

export default WishlifyApp;

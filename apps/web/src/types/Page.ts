import React from "react";

import { NextPage } from "next";

export type Page<PageProps = {}> = NextPage<PageProps> & {
  layout?: React.ComponentType;
  getLayout?: (page: React.ReactElement) => React.ReactElement;
};

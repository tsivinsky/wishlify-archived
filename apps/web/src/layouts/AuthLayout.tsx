import React from "react";

import { PrimaryLayout } from "./PrimaryLayout";

export type AuthLayoutProps = {
  children?: React.ReactNode;
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <PrimaryLayout mainContentClassName="flex flex-col justify-center">
      <div className="flex justify-center mx-4">{children}</div>
    </PrimaryLayout>
  );
};

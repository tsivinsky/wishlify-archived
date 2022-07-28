import React from "react";

import clsx from "clsx";

import { Header, HeaderProps } from "@/components/specific/Header";

export type PrimaryLayoutProps = {
  headerProps?: HeaderProps;
  className?: string;
  mainContentClassName?: string;
  children?: React.ReactNode;
};

export const PrimaryLayout: React.FC<PrimaryLayoutProps> = ({
  headerProps,
  className,
  mainContentClassName,
  children,
}) => {
  return (
    <div className={clsx("relative w-full min-h-screen", className)}>
      <Header {...headerProps} />
      <main
        className={clsx(
          "min-h-screen-without-header bg-gray-50 p-2",
          mainContentClassName
        )}
      >
        {children}
      </main>
    </div>
  );
};

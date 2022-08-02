import React from "react";

import clsx from "clsx";

export type PrimaryLayoutProps = {
  className?: string;
  mainContentClassName?: string;
  children?: React.ReactNode;
};

export const PrimaryLayout: React.FC<PrimaryLayoutProps> = ({
  className,
  mainContentClassName,
  children,
}) => {
  return (
    <div className={clsx("relative w-full min-h-screen", className)}>
      <main
        className={clsx(
          "min-h-screen-without-header bg-gray-50",
          mainContentClassName
        )}
      >
        {children}
      </main>
    </div>
  );
};

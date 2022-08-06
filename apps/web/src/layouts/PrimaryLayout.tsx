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
          "min-h-screen transition-colors bg-gray-50 dark:bg-primary-dark",
          mainContentClassName
        )}
      >
        {children}
      </main>
    </div>
  );
};

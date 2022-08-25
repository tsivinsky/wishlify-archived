import React from "react";

import clsx from "clsx";

export type PlaceholderProps = {
  className?: string;
  children?: React.ReactNode;
};

export const Placeholder: React.FC<PlaceholderProps> = ({
  className,
  children,
}) => {
  return (
    <div
      className={clsx(
        "w-full blur-sm animate-pulse bg-neutral-300/50 dark:bg-neutral-700/70 rounded-lg",
        className
      )}
    >
      <div className="invisible">{children}</div>
    </div>
  );
};

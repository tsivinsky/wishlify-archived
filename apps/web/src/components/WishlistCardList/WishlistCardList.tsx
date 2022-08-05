import React from "react";

import clsx from "clsx";

export type WishlistCardListProps = JSX.IntrinsicElements["div"] & {
  count: number;
};

export const WishlistCardList: React.FC<WishlistCardListProps> = ({
  className,
  children,
  count,
  ...props
}) => {
  return (
    <div
      className={clsx("gap-4", className, {
        "grid [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]":
          count >= 6,
        "flex flex-wrap": count < 6,
      })}
      {...props}
    >
      {children}
    </div>
  );
};

import React from "react";

import { Panel, PanelProps } from "@wishlify/ui";

import { Wishlist } from "@prisma/client";
import clsx from "clsx";

import { dayjs } from "@/utils/dayjs";

const WishlistCardDefaultElement = "div";

export type WishlistCardProps<
  E extends React.ElementType = typeof WishlistCardDefaultElement
> = PanelProps<E> & {
  wishlist: Wishlist;
};

export const WishlistCard = <
  E extends React.ElementType = typeof WishlistCardDefaultElement
>({
  wishlist,
  className,
  ...props
}: WishlistCardProps<E>) => {
  return (
    <Panel
      size="small"
      className={clsx(
        "w-full sm:w-[200px] shadow rounded-lg flex flex-col justify-between cursor-pointer hover:border-primary/40 hover:dark:border-primary/90 hover:shadow-none",
        className
      )}
      {...props}
    >
      <div className="flex justify-between gap-1">
        <h3 className="line-clamp-2 dark:text-white/90">{wishlist.name}</h3>
      </div>
      <span className="text-black/70 text-xs mt-2 dark:text-white/90">
        {dayjs(wishlist.createdAt).format("DD.MM.YYYY")}
      </span>
    </Panel>
  );
};

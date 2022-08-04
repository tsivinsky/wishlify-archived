import React from "react";

import { Panel, PanelProps } from "@wishlify/ui";

import { Wishlist } from "@prisma/client";
import clsx from "clsx";

import { dayjs } from "@/utils/dayjs";

export type WishlistCardProps = PanelProps & {
  wishlist: Wishlist;
};

export const WishlistCard: React.FC<WishlistCardProps> = ({
  wishlist,
  className,
  ...props
}) => {
  return (
    <Panel
      size="small"
      className={clsx(
        "w-full sm:w-[200px] shadow rounded-lg flex flex-col justify-between cursor-pointer hover:border-primary/40 hover:shadow-none",
        className
      )}
      {...props}
    >
      <div className="flex justify-between gap-1">
        <h3 className="line-clamp-2">{wishlist.name}</h3>
      </div>
      <span className="text-black/70 text-xs mt-2">
        {dayjs(wishlist.createdAt).format("DD.MM.YYYY")}
      </span>
    </Panel>
  );
};

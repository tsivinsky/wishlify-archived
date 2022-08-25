import React, { useMemo } from "react";

import { Panel, PanelProps } from "@wishlify/ui";

import { Wishlist } from "@prisma/client";
import clsx from "clsx";

import { dayjs } from "@/utils/dayjs";

import { Placeholder } from "../Placeholder";

const WishlistCardDefaultElement = "div";

export type WishlistCardProps<
  E extends React.ElementType = typeof WishlistCardDefaultElement
> = PanelProps<E> & {
  wishlist: Wishlist | undefined;
  isSelected?: boolean;
};

export const WishlistCard = <
  E extends React.ElementType = typeof WishlistCardDefaultElement
>({
  wishlist,
  isSelected = false,
  className,
  ...props
}: WishlistCardProps<E>) => {
  const isPlaceholder = useMemo(
    () => typeof wishlist === "undefined",
    [wishlist]
  );

  return (
    <Panel
      size="small"
      className={clsx(
        "w-full sm:w-[200px] shadow rounded-lg flex flex-col justify-between cursor-pointer hover:border-primary/40 hover:dark:border-primary/90 hover:shadow-none",
        className,
        {
          "!border-primary/80 shadow-none": isSelected,
        }
      )}
      {...props}
    >
      <div className="flex justify-between gap-1">
        <h3 className="line-clamp-2 dark:text-white/90">
          {isPlaceholder ? (
            <Placeholder>placeholder name</Placeholder>
          ) : (
            wishlist?.name
          )}
        </h3>
      </div>
      <div className="text-black/70 text-xs mt-2 dark:text-white/90">
        {isPlaceholder ? (
          <Placeholder>{dayjs().format("DD.MM.YYYY")}</Placeholder>
        ) : (
          dayjs(wishlist?.createdAt).format("DD.MM.YYYY")
        )}
      </div>
    </Panel>
  );
};

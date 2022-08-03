import React from "react";

import Link from "next/link";

import { Panel } from "@wishlify/ui";

import { Wishlist } from "@prisma/client";

import { dayjs } from "@/utils/dayjs";

export type WishlistCardProps = {
  wishlist: Wishlist;
  link: string;
};

export const WishlistCard: React.FC<WishlistCardProps> = ({
  wishlist,
  link,
}) => {
  return (
    <Link href={link} passHref>
      <Panel
        as="a"
        size="small"
        className="w-full sm:w-[200px] shadow rounded-lg hover:border-primary/40 hover:shadow-none"
      >
        <div className="flex justify-between gap-1">
          <h3 className="text-lg">{wishlist.name}</h3>
        </div>
        <span className="text-black/70 text-xs">
          {dayjs(wishlist.createdAt).format("DD.MM.YYYY")}
        </span>
      </Panel>
    </Link>
  );
};

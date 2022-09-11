import { useMemo } from "react";

import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { Button, Panel, UserAvatar } from "@wishlify/ui";

import { User, Wishlist } from "@prisma/client";
import { useSession } from "next-auth/react";

import { getServerSession } from "@/utils/getServerSession";
import { getTRPCClient } from "@/utils/getTRPCClient";
import { trpc } from "@/utils/trpc";

import { DashboardLayout } from "@/layouts/DashboardLayout";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { Page } from "@/types/Page";

type WishlistPageParams = {
  username: string;
  wishlistName: string;
};

type WishlistPageProps = {
  user?: User;
  wishlist?: Wishlist;
  wishlistName: string;
};

const WishlistPage: Page<WishlistPageProps> = ({
  user,
  wishlist: initialWishlist,
  wishlistName,
}) => {
  const { data: session } = useSession();

  const { data: wishlist } = trpc.useQuery(
    ["wishlists.findByDisplayName", { displayName: wishlistName }],
    { initialData: initialWishlist }
  );

  const isSameUser = session?.user.id === user?.id;

  return (
    <>
      <Head>
        <title>Wishlify | {wishlist?.name}</title>
        <meta name="description" content={wishlist?.name ?? "Wishlify"} />
      </Head>

      <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div id="owner-info" className="w-full flex gap-3 items-center py-2">
            <Link href={`/${user?.username}`} passHref>
              <a className="cursor-pointer">
                <UserAvatar
                  src={user?.avatar}
                  fallback={user?.username?.[0] ?? ""}
                  size={42}
                  fallbackClassName="!text-lg"
                />
              </a>
            </Link>
            <div className="flex flex-col">
              <h3 className="text-xl dark:text-white/90">{wishlist?.name}</h3>
              <Link href={`/${user?.username}`} passHref>
                <a className="text-xs dark:text-white/90">{user?.username}</a>
              </Link>
            </div>
          </div>

          <div>
            {isSameUser && (
              <Button className="w-full whitespace-nowrap">
                Добавить товар
              </Button>
            )}
          </div>
        </div>

        <div id="products-list" className="py-2 mt-2">
          <h3 className="dark:text-white/90">products will go here</h3>
        </div>
      </div>
    </>
  );
};

WishlistPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export const getServerSideProps: GetServerSideProps<
  WishlistPageProps,
  WishlistPageParams
> = async (ctx) => {
  const { username, wishlistName } = ctx.params || {};

  if (!username || !wishlistName) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  const client = getTRPCClient();

  const result = await Promise.all([
    client.query("user.findByUsername", { username }),
    client.query("wishlists.findByDisplayName", { displayName: wishlistName }),
  ]).catch((err) => {});
  if (!result) {
    return {
      notFound: true,
    };
  }

  const [user, wishlist] = result;

  if (!user || !wishlist) {
    return {
      notFound: true,
    };
  }

  if (wishlist.userId !== session?.user.id && wishlist.private) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      user,
      wishlist,
      wishlistName,
    },
  };
};

export default WishlistPage;

import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { Button } from "@wishlify/ui";

import { User, Wishlist } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";

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
  const router = useRouter();

  const { data: wishlist } = trpc.useQuery(
    ["wishlists.findByDisplayName", { displayName: wishlistName }],
    { initialData: initialWishlist }
  );

  return (
    <>
      <Head>
        <title>Wishlify | {wishlist?.name}</title>
      </Head>

      <Button
        variant="outlined"
        color="gray"
        size="small"
        className="mb-2"
        onClick={() => router.back()}
      >
        Назад
      </Button>

      <h3 className="text-xl dark:text-white/90">{wishlist?.name}</h3>
      <pre className="dark:text-white/90 overflow-hidden">
        {JSON.stringify(wishlist, undefined, "  ")}
      </pre>
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

  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );

  const client = getTRPCClient();

  const [user, wishlist] = await Promise.all([
    client.query("user.findByUsername", { username }),
    client.query("wishlists.findByDisplayName", { displayName: wishlistName }),
  ]);

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
      user,
      wishlist,
      wishlistName,
    },
  };
};

export default WishlistPage;

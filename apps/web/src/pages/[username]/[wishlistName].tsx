import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { Button } from "@wishlify/ui";

import { trpc } from "@/utils/trpc";

import { DashboardLayout } from "@/layouts/DashboardLayout";

import { Page } from "@/types/Page";

type WishlistPageParams = {
  username: string;
  wishlistName: string;
};

const WishlistPage: Page<WishlistPageParams> = ({ username, wishlistName }) => {
  const router = useRouter();

  const wishlist = trpc.useQuery([
    "wishlists.findByDisplayName",
    { displayName: wishlistName },
  ]);

  return (
    <div>
      <Button
        variant="outlined"
        color="gray"
        size="small"
        className="mb-2"
        onClick={() => router.back()}
      >
        Назад
      </Button>

      <h3>{wishlist.data?.name}</h3>
    </div>
  );
};

WishlistPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export const getServerSideProps: GetServerSideProps<
  WishlistPageParams,
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

  return {
    props: {
      username,
      wishlistName,
    },
  };
};

export default WishlistPage;

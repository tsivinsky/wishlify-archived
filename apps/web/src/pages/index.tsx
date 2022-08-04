import { GetServerSideProps } from "next";

import { Button } from "@wishlify/ui";

import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

import { trpc } from "@/utils/trpc";

import {
  CreateWishlistForm,
  NewWishlistModal,
  useNewWishlistModal,
} from "@/components/NewWishlistModal";
import { WishlistCard } from "@/components/WishlistCard";
import { DashboardLayout } from "@/layouts/DashboardLayout";

import { Page } from "@/types/Page";

import { authOptions } from "./api/auth/[...nextauth]";

const HomePage: Page = () => {
  const { data: session } = useSession();

  const wishlists = trpc.useQuery(["wishlists.get-all"]);
  const createWishlist = trpc.useMutation(["wishlists.create"]);

  const { openNewWishlistModal, closeNewWishlistModal } = useNewWishlistModal();

  const onSubmit = async (data: CreateWishlistForm) => {
    await createWishlist.mutateAsync(data);
    await wishlists.refetch();
    closeNewWishlistModal();
  };

  return (
    <div>
      <NewWishlistModal onSubmit={onSubmit} />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">
          Привет, {session?.user?.username}
        </h2>
        <Button onClick={() => openNewWishlistModal()}>Создать вишлист</Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        {wishlists.data?.map((wishlist) => (
          <WishlistCard
            key={wishlist.id}
            wishlist={wishlist}
            link={`/${session?.user.username}/${wishlist.displayName}`}
          />
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

HomePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HomePage;

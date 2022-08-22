import { useState } from "react";

import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { getDeclensionByNumber } from "@wishlify/lib";

import { Wishlist } from "@prisma/client";
import clsx from "clsx";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useConfirm } from "use-confirm";

import { trpc } from "@/utils/trpc";

import { NewWishlistModal } from "@/components/NewWishlistModal";
import { WishlistCard } from "@/components/WishlistCard";
import { WishlistsControls } from "@/components/WishlistsControls";
import { DashboardLayout } from "@/layouts/DashboardLayout";

import { Page } from "@/types/Page";

import { authOptions } from "./api/auth/[...nextauth]";

const HomePage: Page = () => {
  const { data: session } = useSession({ required: true });

  const router = useRouter();

  const wishlists = trpc.useQuery([
    "wishlists.findByOwner",
    { userId: session?.user.id ?? null, includePrivate: true },
  ]);
  const deleteWishlists = trpc.useMutation(["wishlists.delete"]);

  const { ask } = useConfirm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openNewWishlistModal = () => setIsModalOpen(true);
  const closeNewWishlistModal = () => setIsModalOpen(false);

  const [selectedWishlists, setSelectedWishlists] = useState<string[]>([]);
  const toggleSelectedWishlist = (wishlistId: string) => {
    if (selectedWishlists.includes(wishlistId)) {
      setSelectedWishlists((prev) => prev.filter((id) => id !== wishlistId));
    } else {
      setSelectedWishlists((prev) => [...prev, wishlistId]);
    }
  };

  const openWishlistPage = (wishlist: Wishlist) => {
    const url = `/${session?.user.username}/${wishlist.displayName}`;
    router.push(url);
  };

  const handleClickOnCard = (e: React.MouseEvent, wishlist: Wishlist) => {
    if (e.ctrlKey || selectedWishlists.length > 0) {
      toggleSelectedWishlist(wishlist.id);
    } else {
      openWishlistPage(wishlist);
    }
  };

  const handleKeydownOnCard = (
    e: React.KeyboardEvent<HTMLDivElement>,
    wishlist: Wishlist
  ) => {
    if (e.key === "Enter") {
      openWishlistPage(wishlist);
    } else if (e.key === " ") {
      toggleSelectedWishlist(wishlist.id);
    }
  };

  const onCreateNewWishlist = async () => {
    closeNewWishlistModal();
    await wishlists.refetch();
  };

  const deleteSelectedWishlists = async () => {
    const ok = await ask(
      `Вы собираетесь удалить ${
        selectedWishlists.length
      } ${getDeclensionByNumber(
        selectedWishlists.length,
        "вишлист",
        "вишлиста",
        "вишлистов"
      )}. Вы уверены?`
    );
    if (!ok) return;

    await deleteWishlists.mutateAsync({ wishlists: selectedWishlists });
    setSelectedWishlists([]);
    await wishlists.refetch();
  };

  return (
    <>
      <Head>
        <title>Wishlify</title>
        <meta name="description" content="Домашняя страница Wishlify" />
      </Head>
      <NewWishlistModal
        isOpen={isModalOpen}
        onClose={closeNewWishlistModal}
        onSuccess={onCreateNewWishlist}
      />

      <div className="flex flex-col gap-2 justify-between sm:flex-row sm:items-center">
        <h2 className="text-2xl font-medium dark:text-white/90">
          Привет, {session?.user?.username}
        </h2>
        <WishlistsControls
          selectedWishlistsCount={selectedWishlists.length}
          onCreateWishlist={openNewWishlistModal}
          onDelete={deleteSelectedWishlists}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        {wishlists.data?.map((wishlist) => (
          <WishlistCard
            key={wishlist.id}
            wishlist={wishlist}
            isSelected={selectedWishlists.includes(wishlist.id)}
            className="flex-grow"
            tabIndex={0}
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
              handleClickOnCard(e, wishlist)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
              handleKeydownOnCard(e, wishlist)
            }
          />
        ))}
      </div>
    </>
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

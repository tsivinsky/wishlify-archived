import { useState } from "react";

import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { Button } from "@wishlify/ui";

import { Wishlist } from "@prisma/client";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
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

  const router = useRouter();

  const wishlists = trpc.useQuery(["wishlists.get-all"]);
  const createWishlist = trpc.useMutation(["wishlists.create"]);
  const deleteWishlists = trpc.useMutation(["wishlists.delete"]);

  const { openNewWishlistModal, closeNewWishlistModal } = useNewWishlistModal();

  const [selectedWishlists, setSelectedWishlists] = useState<string[]>([]);
  const toggleSelectedWishlist = (wishlistId: string) => {
    if (selectedWishlists.includes(wishlistId)) {
      setSelectedWishlists((prev) => prev.filter((id) => id !== wishlistId));
    } else {
      setSelectedWishlists((prev) => [...prev, wishlistId]);
    }
  };

  const onSubmit = async (data: CreateWishlistForm) => {
    await createWishlist.mutateAsync(data);
    await wishlists.refetch();
    closeNewWishlistModal();
  };

  const handleClickOnCard = (e: React.MouseEvent, wishlist: Wishlist) => {
    if (e.ctrlKey || selectedWishlists.length > 0) {
      toggleSelectedWishlist(wishlist.id);
    } else {
      const wishlistLink = `/${session?.user.username}/${wishlist.displayName}`;
      router.push(wishlistLink);
    }
  };

  const handleDeleteSelectedWishlists = async () => {
    await deleteWishlists.mutateAsync({ wishlists: selectedWishlists });
    setSelectedWishlists([]);
    await wishlists.refetch();
  };

  return (
    <>
      <Head>
        <title>Wishlify | Главная страница</title>
      </Head>

      <NewWishlistModal
        onSubmit={onSubmit}
        isLoading={createWishlist.isLoading}
      />

      <div className="flex flex-col gap-2 justify-between sm:flex-row sm:items-center">
        <h2 className="text-2xl font-medium">
          Привет, {session?.user?.username}
        </h2>
        <div className="flex gap-4 items-center">
          <AnimatePresence exitBeforeEnter>
            {selectedWishlists.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 3 }}
                transition={{ type: "tween" }}
                className="flex items-center gap-4"
              >
                <Button color="red" onClick={handleDeleteSelectedWishlists}>
                  Удалить
                </Button>
                <div className="bg-blue-100 text-blue-800 rounded-md px-2 py-1">
                  <div className="flex gap-1 overflow-hidden">
                    Выбрано:
                    <AnimatePresence exitBeforeEnter initial={false}>
                      <motion.div
                        key={selectedWishlists.length}
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        exit={{ y: -20 }}
                        transition={{ type: "tween" }}
                        className="w-[2ch] flex justify-end"
                      >
                        {selectedWishlists.length}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            className="w-full sm:w-auto"
            onClick={() => openNewWishlistModal()}
          >
            Создать вишлист
          </Button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        {wishlists.data?.map((wishlist) => (
          <WishlistCard
            key={wishlist.id}
            wishlist={wishlist}
            className={clsx("flex-grow", {
              "!border-primary/80 shadow-none": selectedWishlists.includes(
                wishlist.id
              ),
            })}
            onClick={(e) => handleClickOnCard(e, wishlist)}
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

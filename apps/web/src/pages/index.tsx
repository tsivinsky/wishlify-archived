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

import { getTRPCClient } from "@/utils/getTRPCClient";
import { trpc } from "@/utils/trpc";

import { NewWishlistModal } from "@/components/NewWishlistModal";
import { WishlistCard } from "@/components/WishlistCard";
import { DashboardLayout } from "@/layouts/DashboardLayout";

import { Page } from "@/types/Page";

import { authOptions } from "./api/auth/[...nextauth]";

type HomePageProps = {
  wishlists: Array<Wishlist>;
};

const HomePage: Page<HomePageProps> = ({ wishlists: initialWishlists }) => {
  const { data: session } = useSession({ required: true });

  const router = useRouter();

  const wishlists = trpc.useQuery(
    [
      "wishlists.findByOwner",
      { userId: session?.user.id ?? null, includePrivate: true },
    ],
    {
      enabled: typeof session !== "undefined",
      initialData: initialWishlists,
    }
  );
  const deleteWishlists = trpc.useMutation(["wishlists.delete"]);

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

  const handleClickOnCard = (e: React.MouseEvent, wishlist: Wishlist) => {
    if (e.ctrlKey || selectedWishlists.length > 0) {
      toggleSelectedWishlist(wishlist.id);
    } else {
      const wishlistLink = `/${session?.user.username}/${wishlist.displayName}`;
      router.push(wishlistLink);
    }
  };

  const onCreateNewWishlist = async () => {
    closeNewWishlistModal();
    await wishlists.refetch();
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
        isOpen={isModalOpen}
        onClose={closeNewWishlistModal}
        onSuccess={onCreateNewWishlist}
      />

      <div className="flex flex-col gap-2 justify-between sm:flex-row sm:items-center">
        <h2 className="text-2xl font-medium dark:text-white/90">
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
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
              handleClickOnCard(e, wishlist)
            }
          />
        ))}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  ctx
) => {
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

  const client = getTRPCClient();

  const wishlists = await client.query("wishlists.findByOwner", {
    userId: session.user.id,
    includePrivate: true,
  });

  return {
    props: {
      session,
      wishlists,
    },
  };
};

HomePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HomePage;

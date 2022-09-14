import { useState } from "react";

import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useModal } from "@wishlify/lib";
import { Button, Panel, UserAvatar } from "@wishlify/ui";

import { User, Wishlist } from "@prisma/client";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useConfirm } from "use-confirm";

import { dayjs } from "@/utils/dayjs";
import { getFullImageUrl } from "@/utils/getFullImageUrl";
import { getServerSession } from "@/utils/getServerSession";
import { getTRPCClient } from "@/utils/getTRPCClient";
import { trpc } from "@/utils/trpc";

import { NewProductModal } from "@/components/NewProductModal";
import { ProductSidebar } from "@/components/ProductSidebar";
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

  const { data: wishlist, refetch: refetchWishlist } = trpc.useQuery(
    ["wishlists.findByDisplayName", { displayName: wishlistName }],
    { initialData: initialWishlist }
  );

  const deleteProductMutation = trpc.useMutation(["products.delete"]);

  const { ask } = useConfirm();

  const [openedProductId, setOpenedProductId] = useState<string>();
  const openedProduct = wishlist?.products.find(
    (product) => product.id === openedProductId
  );

  const productModal = useModal(false);
  const productSidebar = useModal(false);

  const isSameUser = session?.user.id === user?.id;

  const onAddProductSuccess = async () => {
    productModal.close();
    await refetchWishlist();
  };

  const openProductSidebar = (productId: string) => {
    if (openedProductId === productId) {
      setOpenedProductId(undefined);
      productSidebar.close();
    } else {
      setOpenedProductId(productId);
      productSidebar.open();
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const ok = await ask("Вы уверены что хотите удалить этот товар?");
    if (!ok) return;

    deleteProductMutation.mutate(
      { id: productId },
      {
        onSuccess: async () => {
          productSidebar.close();
          setOpenedProductId(undefined);
          await refetchWishlist();
        },
      }
    );
  };

  return (
    <>
      <Head>
        <title>Wishlify | {wishlist?.name}</title>
        <meta name="description" content={wishlist?.name ?? "Wishlify"} />
      </Head>

      <NewProductModal
        isOpen={productModal.isOpen}
        onClose={productModal.close}
        wishlistId={wishlist?.id}
        onSuccess={onAddProductSuccess}
      />

      <div className="flex gap-4 relative">
        <motion.div className="w-full">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div
              id="owner-info"
              className="w-full flex gap-3 items-center py-2"
            >
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
                <Button
                  className="w-full whitespace-nowrap"
                  onClick={productModal.open}
                >
                  Добавить товар
                </Button>
              )}
            </div>
          </div>

          <div id="products-list" className="py-2 mt-2 flex flex-col gap-4">
            {wishlist?.products.map((product) => (
              <Panel
                key={product.id}
                size="unsized"
                className="overflow-hidden flex cursor-pointer"
                onClick={() => openProductSidebar(product.id)}
                withHoverEffect
              >
                {product.image ? (
                  <div className="w-28 h-24 relative">
                    <Image
                      src={getFullImageUrl(product.image)!}
                      alt={product.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-24 transition-colors duration-200 bg-neutral-300/40 dark:bg-neutral-800" />
                )}
                <div className="p-2 flex flex-col justify-between">
                  <h2 className="text-lg">{product.title}</h2>
                  <span className="text-sm">
                    Добавлено{" "}
                    {dayjs(product.createdAt).format("DD.MM.YYYY в HH:mm")}
                  </span>
                </div>
              </Panel>
            ))}
          </div>
        </motion.div>

        <ProductSidebar
          isOpen={productSidebar.isOpen}
          onClose={productSidebar.close}
          product={openedProduct}
          onDeleteProduct={handleDeleteProduct}
        />
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

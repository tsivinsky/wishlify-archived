import { GetServerSideProps } from "next";

import { Button, Input } from "@wishlify/ui";

import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

import { trpc } from "@/utils/trpc";

import { WishlistCard } from "@/components/WishlistCard";
import { DashboardLayout } from "@/layouts/DashboardLayout";

import { Page } from "@/types/Page";

import { authOptions } from "./api/auth/[...nextauth]";

type CreateWishlistForm = {
  name: string;
};

const HomePage: Page = () => {
  const { data: session } = useSession();

  const wishlists = trpc.useQuery(["wishlists.get-all"]);

  const createWishlist = trpc.useMutation(["wishlists.create"]);

  const { handleSubmit, register, reset } = useForm<CreateWishlistForm>();

  const onSubmit = async (data: CreateWishlistForm) => {
    await createWishlist.mutateAsync({ name: data.name });
    await wishlists.refetch();
    reset();
  };

  return (
    <div>
      {session && (
        <h2 className="text-2xl font-medium">
          Привет, {session.user?.username}
        </h2>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 items-start mt-4"
      >
        <Input
          type="text"
          placeholder="Awesome wishlist name"
          {...register("name")}
        />
        <Button type="submit">Создать</Button>
      </form>

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

import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { Panel, UserAvatar } from "@wishlify/ui";

import { User, Wishlist } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

import { getTRPCClient } from "@/utils/getTRPCClient";
import { trpc } from "@/utils/trpc";

import { WishlistCard } from "@/components/WishlistCard";
import { DashboardLayout } from "@/layouts/DashboardLayout";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { Page } from "@/types/Page";

type ProfilePageParams = {
  username: string;
};

type ProfilePageProps = {
  user: User;
  wishlists?: Array<Wishlist>;
};

const ProfilePage: Page<ProfilePageProps> = ({
  user,
  wishlists: initialWishlists,
}) => {
  const { data: session } = useSession();

  const router = useRouter();

  const { data: wishlists } = trpc.useQuery(
    [
      "wishlists.findByOwner",
      { userId: user?.id, includePrivate: session?.user.id === user?.id },
    ],
    { initialData: initialWishlists }
  );

  const handleClickOnCard = (wishlist: Wishlist) => {
    router.push(`/${user.username}/${wishlist.displayName}`);
  };

  return (
    <>
      <Head>
        <title>Wishlify | {user?.username}</title>
      </Head>

      <div className="flex flex-col sm:flex-row gap-10">
        <Panel
          size="unsized"
          className="sticky z-sticky top-0 bottom-0 py-5 px-10 rounded-xl shadow flex flex-col items-center gap-3"
        >
          {user && (
            <UserAvatar
              src={user.avatar}
              fallback={user.username?.[0] || user.email[0]}
              size={100}
              fallbackClassName="text-4xl"
            />
          )}
          <h2 className="text-lg font-medium">{user?.username}</h2>
        </Panel>
        <div>
          <div className="flex flex-wrap gap-4">
            {wishlists?.map((wishlist) => (
              <WishlistCard
                key={wishlist.id}
                wishlist={wishlist}
                className="flex-grow"
                onClick={() => handleClickOnCard(wishlist)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

ProfilePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export const getServerSideProps: GetServerSideProps<
  ProfilePageProps,
  ProfilePageParams
> = async (ctx) => {
  const { username } = ctx.params || {};

  if (!username) {
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

  const user = await client.query("user.findByUsername", { username });
  if (!user) {
    return {
      notFound: true,
    };
  }

  const wishlists = await client.query("wishlists.findByOwner", {
    userId: user.id,
    includePrivate: session?.user.id === user.id,
  });

  return {
    props: {
      session,
      user,
      wishlists,
    },
  };
};

export default ProfilePage;

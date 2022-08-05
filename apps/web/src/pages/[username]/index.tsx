import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { UserAvatar } from "@wishlify/ui";

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

  const { data: wishlists } = trpc.useQuery(
    [
      "wishlists.findByOwner",
      { userId: user?.id, includePrivate: session?.user.id === user?.id },
    ],
    { initialData: initialWishlists }
  );

  return (
    <>
      <Head>
        <title>Wishlify | {user?.username}</title>
      </Head>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="sticky z-sticky top-0 bottom-0 py-5 px-10 flex flex-col items-center gap-3">
          {user && (
            <UserAvatar
              src={user.avatar}
              fallback={user.username?.[0] || user.email[0]}
              size={100}
              fallbackClassName="text-4xl"
            />
          )}
          <h2 className="text-lg font-medium">{user?.username}</h2>
        </div>
        <div>
          <div className="flex flex-wrap gap-4">
            {wishlists?.map((wishlist) => (
              <Link
                key={wishlist.id}
                href={`/${user.username}/${wishlist.displayName}`}
                passHref
              >
                <WishlistCard
                  as="a"
                  wishlist={wishlist}
                  className="flex-grow"
                />
              </Link>
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

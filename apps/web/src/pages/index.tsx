import { GetServerSideProps } from "next";

import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

import { PrimaryLayout } from "@/layouts/PrimaryLayout";

import { Page } from "@/types/Page";

import { authOptions } from "./api/auth/[...nextauth]";

const HomePage: Page = () => {
  const { data: session } = useSession();

  return <div>{session && <h2>Привет, {session.user?.username}</h2>}</div>;
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
    props: {},
  };
};

HomePage.getLayout = (page) => <PrimaryLayout>{page}</PrimaryLayout>;

export default HomePage;

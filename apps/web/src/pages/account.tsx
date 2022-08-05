import { GetServerSideProps } from "next";
import Head from "next/head";

import { Button, Input, Panel } from "@wishlify/ui";

import { TRPCError } from "@trpc/server";
import { unstable_getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

import { trpc } from "@/utils/trpc";

import { DashboardLayout } from "@/layouts/DashboardLayout";

import { Page } from "@/types/Page";

import { authOptions } from "./api/auth/[...nextauth]";

type AccountForm = {
  username: string | null;
};

const AccountPage: Page = () => {
  const { data: session } = useSession({ required: true });

  const updateUser = trpc.useMutation(["user.update"]);
  const deleteUser = trpc.useMutation(["user.delete"]);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<AccountForm>({
    defaultValues: { username: session?.user.username },
  });

  const onSubmit = async (data: AccountForm) => {
    try {
      await updateUser.mutateAsync(data);
    } catch (err) {
      const error = err as TRPCError;
      setError("username", { message: error.message });
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Здесь будет другое окно, но потом. А пока, вы точно хотите удалить аккаунт? Это навсегда"
      )
    ) {
      return;
    }

    await deleteUser.mutateAsync();

    signOut();
  };

  return (
    <>
      <Head>
        <title>Wishlify | Настройки аккаунта</title>
      </Head>

      <div>
        <h1 className="text-lg md:text-2xl">
          Настройки аккаунта{" "}
          <span className="font-medium">{session?.user.username}</span>
        </h1>

        <Panel className="mt-4 rounded-lg">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 max-w-screen-lg mx-auto"
          >
            <Input
              type="text"
              label="Никнейм"
              error={!!errors.username}
              helperText={errors.username?.message}
              {...register("username")}
            />
            <Button type="submit" className="self-end">
              Сохранить
            </Button>
          </form>
        </Panel>

        <Panel color="red" className="mt-6 rounded-lg">
          <h2 className="md:text-lg text-red-600">Опасная зона</h2>
          <Button
            color="uncolored"
            className="mt-4 bg-red-600 text-red-100 hover:bg-transparent hover:border-red-600 hover:text-red-600"
            onClick={handleDeleteAccount}
          >
            Удалить аккаунт
          </Button>
        </Panel>
      </div>
    </>
  );
};

AccountPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

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

export default AccountPage;

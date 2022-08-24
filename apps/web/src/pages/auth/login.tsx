import { useState } from "react";

import { GetServerSideProps } from "next";
import Head from "next/head";

import { Button, Input, Panel } from "@wishlify/ui";

import { Provider } from "next-auth/providers";
import { getProviders, signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { getServerSession } from "@/utils/getServerSession";

import { AuthLayout } from "@/layouts/AuthLayout";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { Page } from "@/types/Page";

type LoginFormFields = {
  email: string;
};

type LoginPageProps = {
  providers: Record<string, Provider>;
};

const LoginPage: Page<LoginPageProps> = ({ providers }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormFields>();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormFields) => {
    const emailProvider = providers.email;
    if (!emailProvider) return;

    setIsLoading(true);

    await signIn("email", { email: data.email });

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Wishlify | Вход</title>
        <meta name="description" content="Авторизация Wishlify" />
      </Head>

      <Panel className="max-w-sm w-full shadow-lg rounded-lg">
        <h2 className="text-xl text-center dark:text-white/90">Войти</h2>
        <form
          className="flex flex-col gap-4 mt-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            type="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email", { required: "Обязательное поле" })}
          />
          <Button type="submit" size="large" loading={isLoading}>
            Продолжить
          </Button>
        </form>
      </Panel>
    </>
  );
};

LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const providers = await getProviders();
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      providers,
    },
  };
};

export default LoginPage;

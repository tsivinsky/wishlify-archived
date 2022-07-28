import { GetServerSideProps } from "next";

import { Button, Input, Panel } from "@wishlify/ui";

import { unstable_getServerSession } from "next-auth/next";
import { Provider } from "next-auth/providers";
import { getProviders, signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { PrimaryLayout } from "@/layouts/PrimaryLayout";

import { Page } from "@/types/Page";

import { authOptions } from "../api/auth/[...nextauth]";

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

  const onSubmit = (data: LoginFormFields) => {
    const emailProvider = providers.email;
    if (!emailProvider) return;

    signIn("email", { email: data.email });
  };

  return (
    <div className="flex justify-center items-center">
      <Panel className="max-w-sm w-full shadow-lg mt-32">
        <h2 className="text-xl text-center">Войти</h2>
        <form
          className="flex flex-col gap-4 mt-6"
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
          <Button type="submit" size="large">
            Продолжить
          </Button>
        </form>
      </Panel>
    </div>
  );
};

LoginPage.getLayout = (page) => <PrimaryLayout>{page}</PrimaryLayout>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const providers = await getProviders();
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );

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

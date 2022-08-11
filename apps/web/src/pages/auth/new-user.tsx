import Head from "next/head";
import { useRouter } from "next/router";

import { Button, Input, Panel } from "@wishlify/ui";

import { TRPCError } from "@trpc/server";
import { useForm } from "react-hook-form";

import { trpc } from "@/utils/trpc";

import { AuthLayout } from "@/layouts/AuthLayout";

import { Page } from "@/types/Page";

type UsernameForm = {
  username: string;
};

const NewUserPage: Page = () => {
  const router = useRouter();

  const updateUsername = trpc.useMutation(["user.update"]);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<UsernameForm>();

  const onSubmit = async (data: UsernameForm) => {
    try {
      await updateUsername.mutateAsync({ username: data.username });

      router.push("/");
    } catch (err) {
      const error = err as TRPCError;
      setError("username", { message: error.message });
    }
  };

  return (
    <>
      <Head>
        <title>Wishlify | Спасибо за регистрацию</title>
        <meta name="description" content="Wishlify" />
      </Head>

      <Panel className="max-w-[400px] flex flex-col gap-4 rounded-lg">
        <h2 className="text-lg text-center font-medium dark:text-white/90">
          Спасибо за регистрацию
        </h2>
        <h3 className="text-center dark:text-white/90">
          Остался последний шаг - выбрать никнейм, чтобы другие пользователи
          могли найти вас в Wishlify
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 items-center"
        >
          <Input
            type="text"
            placeholder="awesome-username"
            error={!!errors.username}
            helperText={errors.username?.message}
            {...register("username", { required: "Обязательное поле" })}
          />
          <Button
            type="submit"
            className="mt-3"
            loading={updateUsername.isLoading}
          >
            Сохранить
          </Button>
        </form>
      </Panel>
    </>
  );
};

NewUserPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default NewUserPage;

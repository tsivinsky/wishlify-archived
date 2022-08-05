import Head from "next/head";
import { useRouter } from "next/router";

import { Button, Input, Panel } from "@wishlify/ui";

import { TRPCError } from "@trpc/server";
import { useForm } from "react-hook-form";

import { trpc } from "@/utils/trpc";

import { PrimaryLayout } from "@/layouts/PrimaryLayout";

import { Page } from "@/types/Page";

type UsernameForm = {
  username: string;
};

const NewUserPage: Page = () => {
  const router = useRouter();

  const updateUsername = trpc.useMutation(["user.update-username"]);

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
    <div className="flex justify-center">
      <Head>
        <title>Wishlify | Спасибо за регистрацию</title>
      </Head>

      <Panel className="max-w-[400px] flex flex-col gap-4 mt-32">
        <h2 className="text-lg text-center font-medium">
          Спасибо за регистрацию
        </h2>
        <h3 className="text-center">
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
    </div>
  );
};

NewUserPage.getLayout = (page) => <PrimaryLayout>{page}</PrimaryLayout>;

export default NewUserPage;

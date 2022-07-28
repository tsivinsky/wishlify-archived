import { useRouter } from "next/router";

import { Button, Input, Panel } from "@wishlify/ui";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { PrimaryLayout } from "@/layouts/PrimaryLayout";

import { Page } from "@/types/Page";

type UsernameForm = {
  username: string;
};

const NewUserPage: Page = () => {
  const router = useRouter();

  const checkUsernameMutation = useMutation(async (username: string) => {
    const resp = await fetch("/api/check-username", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
    return (await resp.json()) as { ok: boolean };
  });

  const updateUserMutation = useMutation(async (username: string) => {
    const resp = await fetch("/api/user", {
      method: "PATCH",
      body: JSON.stringify({ username }),
    });
    return await resp.json();
  });

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<UsernameForm>();

  const onSubmit = async (data: UsernameForm) => {
    const result = await checkUsernameMutation.mutateAsync(data.username);

    if (!result.ok) {
      return setError("username", {
        message: "Никнейм уже занят",
      });
    }

    try {
      await updateUserMutation.mutateAsync(data.username);

      router.push("/");
    } catch (err) {}
  };

  return (
    <div className="flex justify-center">
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
            loading={
              checkUsernameMutation.isLoading || updateUserMutation.isLoading
            }
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

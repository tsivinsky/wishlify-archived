import { GetServerSideProps } from "next";
import Head from "next/head";

import { useFileInput } from "@wishlify/lib";
import { Button, FileInput, Input, Panel, UserAvatar } from "@wishlify/ui";

import { signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useConfirm } from "use-confirm";

import { useUploadFileMutation } from "@/features/files";
import { getServerSession } from "@/utils/getServerSession";
import { reloadSession } from "@/utils/reloadSession";
import { trpc } from "@/utils/trpc";

import { DashboardLayout } from "@/layouts/DashboardLayout";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { Page } from "@/types/Page";

type AccountForm = {
  username: string | null;
  avatar: string;
};

const AccountPage: Page = () => {
  const { data: session } = useSession({ required: true });

  const uploadAvatarMutation = useUploadFileMutation({
    deleteUserAvatar: true,
  });

  const updateUserMutation = trpc.useMutation(["user.update"]);
  const deleteUser = trpc.useMutation(["user.delete"]);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<AccountForm>({
    defaultValues: { username: session?.user.username },
  });

  const { ask } = useConfirm();

  const { file, filePreview, onFileChange, clearFile } = useFileInput();

  const onSubmit = async (data: AccountForm) => {
    if (file) {
      const result = await uploadAvatarMutation.mutateAsync(file);
      if (result.image) {
        data.avatar = result.image;
      }
    }

    updateUserMutation.mutate(data, {
      onSuccess: () => {
        clearFile();
        reloadSession();
      },
      onError: (error) => {
        setError("username", { message: error.message });
      },
    });
  };

  const handleDeleteAccount = async () => {
    const ok = await ask("Вы уверены что хотите удалить аккаунт? Это навсегда");
    if (!ok) return;

    await deleteUser.mutateAsync();
    signOut();
  };

  return (
    <>
      <Head>
        <title>Настройки аккаунта {session?.user.username}</title>
        <meta
          name="description"
          content={`Настройки аккаунта ${session?.user.username}`}
        />
      </Head>

      <div>
        <h1 className="text-lg md:text-2xl dark:text-white/90">
          Настройки аккаунта{" "}
          <span className="font-medium">{session?.user.username}</span>
        </h1>

        <Panel className="mt-4 rounded-lg">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 max-w-screen-lg mx-auto"
          >
            <div className="flex justify-center">
              <FileInput onChange={onFileChange}>
                <UserAvatar
                  src={filePreview ?? session?.user.avatar}
                  fallback={session?.user.username?.[0] || ""}
                  size={128}
                  fallbackClassName="!text-5xl"
                />
              </FileInput>
            </div>
            <Input
              type="text"
              label="Никнейм"
              error={!!errors.username}
              helperText={errors.username?.message}
              {...register("username")}
            />
            <Button
              type="submit"
              className="self-end"
              loading={
                uploadAvatarMutation.isLoading || updateUserMutation.isLoading
              }
            >
              Сохранить
            </Button>
          </form>
        </Panel>

        <Panel color="red" className="mt-6 rounded-lg">
          <h2 className="md:text-lg text-red-600">Опасная зона</h2>
          <Button color="red" className="mt-4" onClick={handleDeleteAccount}>
            Удалить аккаунт
          </Button>
        </Panel>
      </div>
    </>
  );
};

AccountPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

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

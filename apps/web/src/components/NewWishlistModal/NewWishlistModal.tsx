import React from "react";

import { Button, Checkbox, Input, Modal, ModalProps } from "@wishlify/ui";

import { useForm } from "react-hook-form";

import { trpc } from "@/utils/trpc";

export type CreateWishlistForm = {
  name: string;
  private: boolean;
};

export type NewWishlistModalProps = ModalProps & {
  onSuccess: () => void;
};

export const NewWishlistModal: React.FC<NewWishlistModalProps> = ({
  onSuccess,
  ...props
}) => {
  const createWishlist = trpc.useMutation(["wishlists.create"]);

  const form = useForm<CreateWishlistForm>({
    defaultValues: {
      private: false,
    },
  });

  const onSubmit = (data: CreateWishlistForm) => {
    createWishlist.mutate(data, {
      onError: (err) => {
        form.setError("name", { message: err.message });
      },
      onSuccess,
    });
  };

  return (
    <Modal
      title="Новый вишлист"
      className="w-[90%] sm:w-[400px]"
      beforeClose={() => form.reset()}
      {...props}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 items-start mt-4"
      >
        <Input
          type="text"
          placeholder="Awesome wishlist name"
          error={!!form.formState.errors.name}
          helperText={form.formState.errors.name?.message}
          {...form.register("name", { required: "Обязательное поле" })}
        />
        <Checkbox
          checked={form.getValues("private")}
          onCheckedChange={(checked) => form.setValue("private", checked)}
          label="Сделать вишлист приватным"
        />
        <Button
          type="submit"
          className="w-full"
          loading={createWishlist.isLoading}
        >
          Создать
        </Button>
      </form>
    </Modal>
  );
};

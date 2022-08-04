import React from "react";

import { Button, Checkbox, Input, Modal } from "@wishlify/ui";

import { useForm } from "react-hook-form";
import create from "zustand";

export type CreateWishlistForm = {
  name: string;
  private: boolean;
};

export type NewWishlistModalState = {
  isNewWishlistModalOpen: boolean;
  openNewWishlistModal: () => void;
  closeNewWishlistModal: () => void;
};

export const useNewWishlistModal = create<NewWishlistModalState>((set) => ({
  isNewWishlistModalOpen: false,
  openNewWishlistModal: () => set({ isNewWishlistModalOpen: true }),
  closeNewWishlistModal: () => set({ isNewWishlistModalOpen: false }),
}));

export type NewWishlistModalProps = {
  onSubmit: (data: CreateWishlistForm) => void;
};

export const NewWishlistModal: React.FC<NewWishlistModalProps> = ({
  onSubmit,
}) => {
  const { isNewWishlistModalOpen, closeNewWishlistModal } =
    useNewWishlistModal();

  const form = useForm<CreateWishlistForm>({
    defaultValues: {
      private: false,
    },
  });

  const _onSubmit = (data: CreateWishlistForm) => {
    form.reset();
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isNewWishlistModalOpen}
      onClose={closeNewWishlistModal}
      title="Новый вишлист"
      className="w-[90%] sm:w-[400px]"
      beforeClose={() => form.reset()}
    >
      <form
        onSubmit={form.handleSubmit(_onSubmit)}
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
        <Button type="submit" className="w-full">
          Создать
        </Button>
      </form>
    </Modal>
  );
};

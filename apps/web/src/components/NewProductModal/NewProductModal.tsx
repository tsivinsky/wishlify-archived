import React from "react";

import { useFileInput } from "@wishlify/lib";
import { Button, FileInput, Input, Modal, ModalProps } from "@wishlify/ui";

import type { Product } from "@prisma/client";
import { useForm } from "react-hook-form";

import { useUploadFileMutation } from "@/features/files";
import { trpc } from "@/utils/trpc";

export type NewProductForm = Pick<Product, "title" | "image">;

export type NewProductModalProps = ModalProps & {
  wishlistId: string | undefined;
  onSuccess: () => void;
};

export const NewProductModal: React.FC<NewProductModalProps> = ({
  wishlistId,
  onSuccess,
  ...props
}) => {
  const addProductMutation = trpc.useMutation(["products.add-to-wishlist"]);
  const uploadFileMutation = useUploadFileMutation<{ image: string }>();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<NewProductForm>();

  const { file, onFileChange, clearFile } = useFileInput();

  const resetModal = () => {
    reset();
    clearFile();
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!wishlistId) return;

    if (file) {
      const { image } = await uploadFileMutation.mutateAsync(file);
      data.image = image;
    }

    await addProductMutation.mutateAsync({
      title: data.title,
      image: data.image,
      wishlistId,
    });

    resetModal();
    onSuccess();
  });

  return (
    <Modal
      title="Новый товар"
      className="w-[90%] sm:w-[400px]"
      beforeClose={resetModal}
      {...props}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-4">
        <FileInput onChange={onFileChange}>
          <Button type="button" variant="outlined">
            {file ? file.name : "Загрузить изображение"}
          </Button>
        </FileInput>
        <Input
          type="text"
          label="Название"
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register("title", { required: "Обязательное поле" })}
        />
        <Button
          type="submit"
          className="self-end"
          loading={addProductMutation.isLoading}
        >
          Добавить товар
        </Button>
      </form>
    </Modal>
  );
};

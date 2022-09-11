import { useMutation } from "@tanstack/react-query";

import { UploadFileOptions, uploadFile } from "./api";

export const useUploadFileMutation = <TResult = { image?: string }>(
  options?: UploadFileOptions
) => {
  return useMutation((file: File) => uploadFile<TResult>(file, options));
};

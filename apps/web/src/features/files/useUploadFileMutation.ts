import { useMutation } from "@tanstack/react-query";

import { uploadFile } from "@/api/file";

export const useUploadFileMutation = <TResult = {}>() => {
  return useMutation((file: File) => uploadFile<TResult>(file));
};

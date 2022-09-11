import { useMutation } from "@tanstack/react-query";

import { uploadAvatar } from "./api";

export const useUploadAvatarMutation = () => {
  return useMutation((file: File) => uploadAvatar<{ image?: string }>(file));
};

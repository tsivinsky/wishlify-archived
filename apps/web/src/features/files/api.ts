export type UploadFileOptions = {
  deleteUserAvatar?: boolean;
};

export async function uploadFile<TResult = {}>(
  file: File,
  { deleteUserAvatar }: UploadFileOptions = {}
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("deleteUserAvatar", String(deleteUserAvatar));

  const resp = await fetch("/api/upload-file", {
    method: "POST",
    body: formData,
  });
  const data = await resp.json();

  return data as TResult;
}

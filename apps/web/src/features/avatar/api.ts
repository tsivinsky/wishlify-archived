export async function uploadAvatar<Result>(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const resp = await fetch("/api/upload-avatar", {
    method: "POST",
    body: formData,
  });

  return (await resp.json()) as Result;
}

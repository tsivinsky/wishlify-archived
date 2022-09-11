export const getFullImageUrl = (filename: string | null) => {
  if (!filename) return;

  return `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/${filename}`;
};

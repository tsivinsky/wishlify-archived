const {
  S3_BUCKET_ACCESS_KEY,
  S3_BUCKET_SECRET_KEY,
  S3_BUCKET_URL,
  S3_BUCKET_REGION,
  S3_BUCKET_NAME,
} = process.env;

if (
  !S3_BUCKET_ACCESS_KEY ||
  !S3_BUCKET_SECRET_KEY ||
  !S3_BUCKET_URL ||
  !S3_BUCKET_REGION ||
  !S3_BUCKET_NAME
) {
  throw new Error("No aws s3 env variables");
}

export const s3Config = {
  accessKey: S3_BUCKET_ACCESS_KEY,
  secretKey: S3_BUCKET_SECRET_KEY,
  url: S3_BUCKET_URL,
  region: S3_BUCKET_REGION,
  name: S3_BUCKET_NAME,
};

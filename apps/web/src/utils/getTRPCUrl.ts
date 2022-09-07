export const getTRPCUrl = () => {
  let url = "http://localhost:3000/api/trpc";

  if (process.env.VERCEL_URL) {
    url = `${process.env.VERCEL_URL}/api/trpc`;
  }

  if (process.env.NEXTAUTH_URL) {
    url = `${process.env.NEXTAUTH_URL}/api/trpc`;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    url = `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`;
  }

  return url;
};

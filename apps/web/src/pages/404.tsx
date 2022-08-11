import Head from "next/head";
import Link from "next/link";

import { Button } from "@wishlify/ui";

const NotFoundPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-around items-center bg-gray-50 dark:bg-primary-dark dark:text-white/90">
      <Head>
        <title>404</title>
        <meta name="description" content="Wishlify 404" />
      </Head>

      <div />
      <div className="flex flex-col gap-4">
        <h1 className="text-8xl md:text-[256px] text-center">404</h1>
        <h2 className="text-lg md:text-3xl text-center">
          Не знаю что вы искали, но этого здесь нет.
        </h2>
      </div>
      <Link href="/" passHref>
        <Button as="a" color="gray" size="large" className="mt-5">
          Домой
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;

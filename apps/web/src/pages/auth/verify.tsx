import Head from "next/head";
import Link from "next/link";

import { Button, Panel } from "@wishlify/ui";

import { AuthLayout } from "@/layouts/AuthLayout";

import { Page } from "@/types/Page";

const VerifyPage: Page = () => {
  return (
    <>
      <Head>
        <title>Wishlify | Подтверждение</title>
      </Head>

      <Panel className="max-w-[520px] flex flex-col items-center rounded-lg">
        <h2 className="font-semibold text-2xl text-center dark:text-white/90">
          Проверьте свою почту
        </h2>
        <h3 className="mt-4 dark:text-white/90">
          Там должно быть письмо с ссылкой для подтверждения входа. А пока,
          можете закрыть эту вкладку.
        </h3>
        <Link href="/" passHref>
          <Button as="a" variant="outlined" className="mt-6">
            Домой
          </Button>
        </Link>
      </Panel>
    </>
  );
};

VerifyPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default VerifyPage;

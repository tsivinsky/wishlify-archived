import Link from "next/link";

import { Button, Panel } from "@wishlify/ui";

import { PrimaryLayout } from "@/layouts/PrimaryLayout";

import { Page } from "@/types/Page";

const VerifyPage: Page = () => {
  return (
    <div className="mt-40 flex justify-center">
      <Panel className="max-w-screen-sm flex flex-col items-center">
        <h2 className="font-semibold text-2xl text-center">
          Проверьте свою почту
        </h2>
        <h3 className="mt-3">
          Там должно быть письмо с ссылкой для подтверждения входа. А пока,
          можете закрыть эту вкладку.
        </h3>
        <Link href="/" passHref>
          <Button as="a" variant="outlined" className="mt-2">
            Домой
          </Button>
        </Link>
      </Panel>
    </div>
  );
};

VerifyPage.getLayout = (page) => <PrimaryLayout>{page}</PrimaryLayout>;

export default VerifyPage;

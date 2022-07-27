import { Button } from "@wishlify/ui";

import { PrimaryLayout } from "@/layouts/PrimaryLayout";

import { Page } from "@/types/Page";

const HomePage: Page = () => {
  return (
    <div>
      <h1>Wishlify</h1>

      <Button>hi mom</Button>
    </div>
  );
};

HomePage.getLayout = (page) => <PrimaryLayout>{page}</PrimaryLayout>;

export default HomePage;

import { useSession } from "next-auth/react";

import { PrimaryLayout } from "@/layouts/PrimaryLayout";

import { Page } from "@/types/Page";

const ProfilePage: Page = () => {
  const { data: session } = useSession({ required: true });

  return (
    <div>
      <h2>{session?.user.username}</h2>
    </div>
  );
};

ProfilePage.getLayout = (page) => <PrimaryLayout>{page}</PrimaryLayout>;

export default ProfilePage;

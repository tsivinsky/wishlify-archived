import { useSession } from "next-auth/react";

import { DashboardLayout } from "@/layouts/DashboardLayout";

import { Page } from "@/types/Page";

const ProfilePage: Page = () => {
  const { data: session } = useSession({ required: true });

  return (
    <div>
      <h2>{session?.user.username}</h2>
    </div>
  );
};

ProfilePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProfilePage;

import React from "react";

import { Button } from "@wishlify/ui";

import { signOut, useSession } from "next-auth/react";

export const HeaderUserMenu: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-2">
      <h2>{session?.user.username}</h2>
      <Button onClick={() => signOut()} variant="outlined" size="small">
        Выйти
      </Button>
    </div>
  );
};

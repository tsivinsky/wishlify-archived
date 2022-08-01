import React from "react";

import Link from "next/link";

import { Button, Popover, UserAvatar } from "@wishlify/ui";

import { signIn, signOut, useSession } from "next-auth/react";
import { UserCircle } from "phosphor-react";

export const HeaderUserMenu: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="flex items-center">
      {session ? (
        <Popover
          trigger={
            <button className="flex items-center gap-2 py-2 px-2 md:px-4 rounded-full md:rounded-xl transition-colors duration-200 hover:bg-gray-100">
              <span className="hidden md:inline">{session.user.username}</span>
              <UserAvatar
                src={session.user.avatar}
                fallback={session.user.username?.[0] || ""}
              />
            </button>
          }
          side="bottom"
          align="end"
          sideOffset={24}
          className="w-[180px] p-3 flex flex-col gap-3"
        >
          <Link href="/profile" passHref>
            <Button
              as="a"
              color="gray"
              icon={<UserCircle size={24} />}
              className="!justify-start hover:bg-gray-100"
            >
              Профиль
            </Button>
          </Link>
          <Button variant="outlined" color="gray" onClick={() => signOut()}>
            Выйти
          </Button>
        </Popover>
      ) : (
        <Button variant="outlined" size="small" onClick={() => signIn()}>
          Войти
        </Button>
      )}
    </div>
  );
};

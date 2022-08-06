import React, { useState } from "react";

import Link from "next/link";

import { useRouterEvent } from "@wishlify/lib";
import { Button, Popover, UserAvatar } from "@wishlify/ui";

import { signIn, signOut, useSession } from "next-auth/react";
import { GearSix, UserCircle } from "phosphor-react";

export const HeaderUserMenu: React.FC = () => {
  const { data: session } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useRouterEvent("routeChangeStart", () => setIsMenuOpen(false));

  return (
    <div className="flex items-center">
      {session ? (
        <>
          <button
            className="flex items-center gap-2 py-2 px-2 md:px-4 rounded-full md:rounded-xl transition-colors duration-200 hover:bg-gray-100 hover:dark:bg-neutral-700"
            onClick={() => setIsMenuOpen(true)}
          >
            <span className="hidden md:inline dark:text-white/90">
              {session.user.username}
            </span>
            <UserAvatar
              src={session.user.avatar}
              fallback={session.user.username?.[0] || ""}
            />
          </button>
          <Popover
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            side="bottom"
            align="end"
            sideOffset={24}
            className="w-[180px] p-3 flex flex-col gap-3"
          >
            <Link href={`/${session.user.username}`} passHref>
              <a className="flex gap-2 items-center p-1 rounded-md text-neutral-700 dark:text-neutral-200 transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-500">
                <UserCircle size={24} />
                <span>Профиль</span>
              </a>
            </Link>
            <Link href="/account" passHref>
              <a className="flex gap-2 items-center p-1 rounded-md text-neutral-700 dark:text-neutral-200 transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-500">
                <GearSix size={24} />
                <span>Аккаунт</span>
              </a>
            </Link>
            <Button variant="outlined" color="gray" onClick={() => signOut()}>
              Выйти
            </Button>
          </Popover>
        </>
      ) : (
        <Button variant="outlined" size="small" onClick={() => signIn()}>
          Войти
        </Button>
      )}
    </div>
  );
};

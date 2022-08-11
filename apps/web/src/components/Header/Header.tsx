import React from "react";

import dynamic from "next/dynamic";
import Link from "next/link";

import { Button } from "@wishlify/ui";

import { signIn, useSession } from "next-auth/react";

import { HeaderUserMenu } from "../HeaderUserMenu";

const DynamicThemeSwitcher = dynamic(() => import("../ThemeSwitcher"), {
  ssr: false,
});

export type HeaderProps = {};

export const Header: React.FC<HeaderProps> = () => {
  const { status } = useSession();

  return (
    <header className="px-3 transition-colors bg-white dark:bg-primary-dark sticky z-header left-0 right-0 top-0 h-header shadow-md">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto h-full">
        <Link href="/" passHref>
          <a>
            <h1 className="text-2xl font-semibold font-outfit transition-colors hover:text-neutral-600 dark:text-white/90 hover:dark:text-neutral-400">
              Wishlify
            </h1>
          </a>
        </Link>
        <div className="flex items-center gap-1">
          <DynamicThemeSwitcher />
          {status === "authenticated" && <HeaderUserMenu />}
          {status === "unauthenticated" && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => signIn("email")}
            >
              Войти
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

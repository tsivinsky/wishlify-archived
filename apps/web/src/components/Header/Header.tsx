import React from "react";

import Link from "next/link";

import { Button } from "@wishlify/ui";

import { signIn, useSession } from "next-auth/react";

import { HeaderUserMenu } from "../HeaderUserMenu";

export type HeaderProps = {};

export const Header: React.FC<HeaderProps> = () => {
  const { status } = useSession();

  return (
    <header className="px-3 bg-white sticky z-header left-0 right-0 top-0 h-header shadow-md">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto h-full">
        <Link href="/" passHref>
          <a>
            <h1 className="text-2xl font-semibold font-outfit">Wishlify</h1>
          </a>
        </Link>
        <div>
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

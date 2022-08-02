import React from "react";

import Link from "next/link";

import { Button } from "@wishlify/ui";

import { signIn, useSession } from "next-auth/react";

import { HeaderUserMenu } from "../HeaderUserMenu";

export type HeaderProps = {};

export const Header: React.FC<HeaderProps> = () => {
  const { status } = useSession();

  return (
    <header className="px-2 md:px-5 sticky z-sticky left-0 right-0 top-0 flex justify-between items-center h-header shadow-md">
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
    </header>
  );
};

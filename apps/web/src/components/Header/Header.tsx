import React, { useEffect, useState } from "react";

import Link from "next/link";

import { useTheme } from "@wishlify/lib";
import { Button } from "@wishlify/ui";

import { signIn, useSession } from "next-auth/react";
import { Moon, Sun } from "phosphor-react";

import { HeaderUserMenu } from "../HeaderUserMenu";

export type HeaderProps = {};

export const Header: React.FC<HeaderProps> = () => {
  const { status } = useSession();

  const { theme, toggleTheme } = useTheme();

  // TODO: add nice transition between icons with framer-motion
  let ThemeIcon = theme === "dark" ? Moon : Sun;

  return (
    <header className="px-3 transition-colors bg-white dark:bg-primary-dark sticky z-header left-0 right-0 top-0 h-header shadow-md">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto h-full">
        <Link href="/" passHref>
          <a>
            <h1 className="text-2xl font-semibold font-outfit dark:text-white/90">
              Wishlify
            </h1>
          </a>
        </Link>
        <div className="flex items-center gap-1">
          <div
            className="cursor-pointer p-1 rounded-full transition-colors duration-200 hover:bg-gray-200 hover:dark:bg-neutral-700"
            onClick={toggleTheme}
          >
            <ThemeIcon size={24} color={theme === "dark" ? "white" : "black"} />
          </div>
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

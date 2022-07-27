import React from "react";

import Link from "next/link";

export type HeaderProps = {};

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header>
      <h1>My App</h1>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  );
};

import React from "react";

import Image from "next/image";

import clsx from "clsx";

export type UserAvatarProps = JSX.IntrinsicElements["div"] & {
  src?: string | null;
  fallback: string;
  size?: number;
  fallbackClassName?: string;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  fallback,
  size = 36,
  className,
  fallbackClassName,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "relative rounded-full grid place-items-center bg-blue-100",
        className
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      {src ? (
        <Image src={src} alt="" layout="fill" objectFit="cover" />
      ) : (
        <div className={clsx("text-sm", fallbackClassName)}>
          {fallback.toUpperCase()}
        </div>
      )}
    </div>
  );
};

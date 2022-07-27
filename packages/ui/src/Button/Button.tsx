import React from "react";

export type ButtonProps = {
  children?: React.ReactNode;
};

export const Button = React.forwardRef(
  ({ children }: ButtonProps, ref?: React.ForwardedRef<HTMLButtonElement>) => {
    return <button ref={ref}>{children}</button>;
  }
);

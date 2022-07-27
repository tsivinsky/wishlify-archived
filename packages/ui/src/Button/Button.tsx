import React from "react";

export type ButtonProps = {
  children?: React.ReactNode;
};

export const Button = React.forwardRef(
  ({ children }: ButtonProps, ref?: React.ForwardedRef<Element>) => {
    return <button ref={ref}>{children}</button>;
  }
);

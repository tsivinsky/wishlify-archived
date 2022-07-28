import React, { useMemo } from "react";

import clsx from "clsx";
import {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithRef,
  PolymorphicPropsWithoutRef,
} from "react-polymorphic-types";

import classes from "./Button.module.css";

const ButtonDefaultElement = "button";

const variantClasses = {
  primary: classes.variantPrimary,
  outlined: classes.variantOutlined,
};

const sizeClasses = {
  small: classes.sizeSmall,
  medium: classes.sizeMedium,
  large: classes.sizeLarge,
  xl: classes.sizeXl,
};

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

export type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export type ButtonProps<
  E extends React.ElementType = typeof ButtonDefaultElement
> = PolymorphicPropsWithRef<ButtonOwnProps, E>;

export type ButtonType = PolymorphicForwardRefExoticComponent<
  ButtonOwnProps,
  typeof ButtonDefaultElement
>;

export const Button: ButtonType = React.forwardRef(
  <E extends React.ElementType = typeof ButtonDefaultElement>(
    {
      as,
      variant = "primary",
      size = "medium",
      className: additionalClassName,
      loading = false,
      disabled,
      children,
      ...props
    }: PolymorphicPropsWithoutRef<ButtonOwnProps, E>,
    ref?: React.ForwardedRef<Element>
  ) => {
    const Element: React.ElementType = as || ButtonDefaultElement;

    const className = useMemo(() => {
      return clsx(
        additionalClassName,
        classes.root,
        variantClasses[variant],
        sizeClasses[size]
      );
    }, [additionalClassName, variant, size]);

    return (
      <Element
        ref={ref}
        className={className}
        disabled={disabled === undefined ? loading : disabled}
        {...props}
      >
        {children}
      </Element>
    );
  }
);

Button.displayName = "Button";

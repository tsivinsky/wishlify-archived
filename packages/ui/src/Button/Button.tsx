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

const colorClasses = {
  blue: classes.colorBlue,
  gray: classes.colorGray,
  red: classes.colorRed,
};

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;
export type ButtonColor = keyof typeof colorClasses;

export type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
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
      color = "blue",
      className: additionalClassName,
      loading = false,
      disabled,
      icon,
      iconPosition = "left",
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
        sizeClasses[size],
        colorClasses[color],
        variantClasses[variant]
      );
    }, [additionalClassName, variant, size, color]);

    return (
      <Element
        ref={ref}
        className={className}
        disabled={disabled === undefined ? loading : disabled}
        {...props}
      >
        {icon && iconPosition === "left" && <>{icon}</>}
        {children}
        {icon && iconPosition === "right" && <>{icon}</>}
      </Element>
    );
  }
);

Button.displayName = "Button";

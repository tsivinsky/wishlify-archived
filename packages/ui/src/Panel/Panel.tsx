import React, { useMemo } from "react";

import clsx from "clsx";
import {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithRef,
  PolymorphicPropsWithoutRef,
} from "react-polymorphic-types";

import classes from "./Panel.module.css";

const PanelDefaultElement = "div";

const variantClasses = {
  plain: classes.variantPlain,
};

const colorClasses = {
  white: classes.colorWhite,
  red: classes.colorRed,
};

const sizeClasses = {
  small: classes.sizeSmall,
  medium: classes.sizeMedium,
  large: classes.sizeLarge,
  unsized: null,
};

export type PanelVariant = keyof typeof variantClasses;
export type PanelColor = keyof typeof colorClasses;
export type PanelSize = keyof typeof sizeClasses;

export type PanelOwnProps = {
  variant?: PanelVariant;
  size?: PanelSize;
};

export type PanelProps<
  E extends React.ElementType = typeof PanelDefaultElement
> = PolymorphicPropsWithRef<PanelOwnProps, E>;

export type PanelType = PolymorphicForwardRefExoticComponent<
  PanelOwnProps,
  typeof PanelDefaultElement
>;

export const Panel: PanelType = React.forwardRef(
  <E extends React.ElementType = typeof PanelDefaultElement>(
    {
      as,
      variant = "plain",
      color = "white",
      size = "medium",
      className: additionalClassName,
      children,
      ...props
    }: PolymorphicPropsWithoutRef<PanelOwnProps, E>,
    ref?: React.ForwardedRef<Element>
  ) => {
    const Element: React.ElementType = as || PanelDefaultElement;

    const className = useMemo(() => {
      return clsx(
        additionalClassName,
        classes.root,
        variantClasses[variant],
        colorClasses[color],
        sizeClasses[size]
      );
    }, [additionalClassName, variant, size]);

    return (
      <Element className={className} ref={ref} {...props}>
        {children}
      </Element>
    );
  }
);

Panel.displayName = "Panel";

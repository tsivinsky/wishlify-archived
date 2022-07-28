import React, { useId, useMemo } from "react";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithRef,
  PolymorphicPropsWithoutRef,
} from "react-polymorphic-types";

import classes from "./Input.module.css";

const InputDefaultElement = "input";

const sizeClasses = {
  small: classes.sizeSmall,
  medium: classes.sizeMedium,
  large: classes.sizeLarge,
};

const colorClasses = {
  primary: classes.colorPrimary,
  error: classes.colorError,
};

export type InputSize = keyof typeof sizeClasses;
export type InputColor = keyof typeof colorClasses;

export type InputOwnProps = {
  size?: InputSize;
  color?: InputColor;
  label?: string;
  error?: boolean;
  helperText?: string;
  labelClassName?: string;
  inputClassName?: string;
  helperTextClassName?: string;
};

export type InputProps<
  E extends React.ElementType = typeof InputDefaultElement
> = PolymorphicPropsWithRef<InputOwnProps, E>;

export type InputType = PolymorphicForwardRefExoticComponent<
  InputOwnProps,
  typeof InputDefaultElement
>;

export const Input: InputType = React.forwardRef(
  <E extends React.ElementType = typeof InputDefaultElement>(
    {
      as,
      size = "medium",
      color = "primary",
      label,
      error,
      helperText,
      className: additionalClassName,
      labelClassName,
      inputClassName,
      helperTextClassName,
      ...props
    }: PolymorphicPropsWithoutRef<InputOwnProps, E>,
    ref?: React.ForwardedRef<Element>
  ) => {
    const Element: React.ElementType = as || InputDefaultElement;

    const id = useId();

    const rootClassName = useMemo(() => {
      return clsx(
        additionalClassName,
        classes.root,
        colorClasses[error ? "error" : color],
        sizeClasses[size]
      );
    }, [additionalClassName, color, error, size]);

    return (
      <div className={rootClassName}>
        {label && (
          <label htmlFor={id} className={clsx(classes.label, labelClassName)}>
            {label}
          </label>
        )}
        <Element
          ref={ref}
          id={id}
          className={clsx(classes.input, inputClassName)}
          {...props}
        />
        <AnimatePresence exitBeforeEnter>
          {typeof helperText !== "undefined" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
            >
              <motion.span
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className={clsx(classes.helperText, helperTextClassName)}
              >
                {helperText}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";

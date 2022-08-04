import React, { useEffect, useState } from "react";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

export type CheckboxProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: number;
  label?: string;
  className?: string;
  labelClassName?: string;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  size = 24,
  label,
  className,
  labelClassName,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (typeof checked === "undefined") return;

    setIsChecked(checked);
  }, [checked]);

  useEffect(() => {
    onCheckedChange?.(isChecked);
  }, [isChecked]);

  const toggle = () => setIsChecked((prev) => !prev);

  return (
    <motion.button
      type="button"
      className={clsx("flex gap-2 items-center", className)}
      onClick={toggle}
      role="checkbox"
      aria-checked={isChecked}
      tabIndex={-1}
    >
      <svg
        style={{ width: size, height: size }}
        className="border border-gray-300 rounded-md grid place-items-center transition-colors duration-200 transform-gpu"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        fill="#000000"
        viewBox="0 0 256 256"
        tabIndex={0}
      >
        <AnimatePresence exitBeforeEnter>
          {isChecked && (
            <motion.polyline
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              transition={{ type: "tween" }}
              points="216 72 104 184 48 128"
              fill="none"
              stroke="#306fcb"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            ></motion.polyline>
          )}
        </AnimatePresence>
      </svg>
      {label && (
        <label className={clsx("cursor-pointer", labelClassName)}>
          {label}
        </label>
      )}
    </motion.button>
  );
};

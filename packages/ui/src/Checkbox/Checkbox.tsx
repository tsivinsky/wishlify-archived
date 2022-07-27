import React, { useEffect, useState } from "react";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

export type CheckboxProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: number;
  className?: string;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  size = 24,
  className,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (!checked) return;

    setIsChecked(checked);
  }, [checked]);

  useEffect(() => {
    onCheckedChange?.(isChecked);
  }, [isChecked]);

  const toggle = () => setIsChecked((prev) => !prev);

  return (
    <motion.button
      style={{ width: size, height: size }}
      className={clsx(
        "border border-gray-300 rounded-md grid place-items-center transition-colors duration-200 transform-gpu",
        className
      )}
      onClick={toggle}
      role="checkbox"
      aria-checked={isChecked}
    >
      <AnimatePresence exitBeforeEnter>
        {isChecked && (
          <motion.svg
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ type: "tween" }}
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            fill="#000000"
            viewBox="0 0 256 256"
          >
            <rect width="256" height="256" fill="none"></rect>
            <polyline
              points="216 72 104 184 48 128"
              fill="none"
              stroke="#306fcb"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            ></polyline>
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

import React, { useMemo } from "react";

import * as RadixPopover from "@radix-ui/react-popover";
import clsx from "clsx";
import { motion } from "framer-motion";

export type PopoverProps = RadixPopover.PopoverContentProps & {
  trigger?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  className,
  children,
  ...props
}) => {
  const [axis, axisOffset] = useMemo(() => {
    if (props.side === "top") return ["y", -10];
    if (props.side === "bottom") return ["y", 10];
    if (props.side === "left") return ["x", -10];
    return ["x", 10];
  }, [props.side]);

  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Anchor />
      <RadixPopover.Content asChild {...props}>
        <motion.div
          initial={{ opacity: 0, [axis]: axisOffset }}
          animate={{ opacity: 1, [axis]: 0 }}
          className={clsx(
            "bg-white shadow-md rounded-lg !outline-none",
            className
          )}
        >
          {children}
        </motion.div>
      </RadixPopover.Content>
    </RadixPopover.Root>
  );
};

import React from "react";

import clsx from "clsx";

import { Popover, PopoverProps } from "../Popover";

export type PopoverMenuItemProps = JSX.IntrinsicElements["div"] & {
  label: string;
  icon?: React.ReactNode;
  labelClassName?: string;
};
export type PopoverMenuItemType = React.FC<PopoverMenuItemProps>;

export type PopoverMenuProps = PopoverProps & {};
export type PopoverMenuType = React.FC<PopoverMenuProps> & {
  Item: PopoverMenuItemType;
};

export const PopoverMenu: PopoverMenuType = ({
  className,
  side = "right",
  sideOffset = 4,
  children,
  ...props
}) => {
  return (
    <Popover
      className={clsx("rounded max-w-[196px] overflow-hidden", className)}
      side={side}
      sideOffset={sideOffset}
      {...props}
    >
      {children}
    </Popover>
  );
};

PopoverMenu.displayName = "PopoverMenu";

PopoverMenu.Item = ({ label, icon, className, labelClassName, ...props }) => {
  return (
    <div
      className={clsx(
        "flex gap-3 items-center py-2 px-4 cursor-pointer hover:bg-grey-lighter",
        className
      )}
      {...props}
    >
      {icon ? icon : <div className="w-[18px] h-[18px]" />}
      <span
        className={clsx(
          "font-medium text-[13px] text-neutral-main leading-[13px]",
          labelClassName
        )}
      >
        {label}
      </span>
    </div>
  );
};

PopoverMenu.Item.displayName = "PopoverMenuItem";

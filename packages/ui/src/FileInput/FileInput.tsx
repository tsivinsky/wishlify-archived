import React, { useRef } from "react";

import { useMergedRef } from "@mantine/hooks";
import clsx from "clsx";

export type FileInputProps = JSX.IntrinsicElements["input"] & {};

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ children, className, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRef(inputRef, ref);

    const handleClick = () => {
      if (!inputRef.current) return;

      inputRef.current.click();
    };

    return (
      <div
        className={clsx("cursor-pointer w-fit", className)}
        onClick={handleClick}
      >
        <input type="file" className="hidden" ref={mergedRef} {...props} />
        {children}
      </div>
    );
  }
);

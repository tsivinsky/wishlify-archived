import { useCallback, useState } from "react";

export const useModal = (defaultState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(defaultState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

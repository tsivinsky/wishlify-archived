import React, { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";

import { useFocusTrap, useScrollLock } from "@mantine/hooks";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { XCircle } from "phosphor-react";

import classes from "./Modal.module.css";

const variantClasses = {
  plain: classes.variantPlain,
};

const sizeClasses = {
  small: classes.sizeSmall,
  medium: classes.sizeMedium,
  large: classes.sizeLarge,
};

export type ModalVariant = keyof typeof variantClasses;
export type ModalSize = keyof typeof sizeClasses;

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  size?: ModalSize;
  className?: string;
  backdropClassName?: string;
  title?: string;
  withCloseButton?: boolean;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  variant = "plain",
  size = "medium",
  className: additionalClassName,
  backdropClassName: additionalBackdropClassName,
  title,
  withCloseButton = true,
  children,
}) => {
  const [, setScrollLocked] = useScrollLock();

  const className = useMemo(() => {
    return clsx(
      additionalClassName,
      variantClasses[variant],
      sizeClasses[size]
    );
  }, [additionalClassName, variant, size]);

  const backdropClassName = useMemo(() => {
    return clsx(classes.backdrop, additionalBackdropClassName);
  }, [additionalBackdropClassName]);

  const modalRef = useFocusTrap();

  useEffect(() => {
    if (isOpen) {
      setScrollLocked(true);
    }

    return () => {
      if (isOpen) {
        setScrollLocked(false);
      }
    };
  }, [isOpen, setScrollLocked]);

  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", closeOnEscape);
    }

    return () => {
      if (isOpen) {
        window.removeEventListener("keydown", closeOnEscape);
      }
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence exitBeforeEnter>
      {isOpen && (
        <>
          {ReactDOM.createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={backdropClassName}
              onClick={() => onClose()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ type: "tween" }}
                className={className}
                role="dialog"
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
              >
                {(!!title || withCloseButton) && (
                  <div
                    className={clsx("flex justify-between items-center mb-1", {
                      "!justify-end": !title && withCloseButton,
                    })}
                  >
                    {title && (
                      <h2 className="font-semibold text-xl">{title}</h2>
                    )}
                    {withCloseButton && (
                      <button
                        className="rounded-full p-0.5"
                        onClick={() => onClose()}
                      >
                        <XCircle size={28} />
                      </button>
                    )}
                  </div>
                )}
                {children}
              </motion.div>
            </motion.div>,
            document.body
          )}
        </>
      )}
    </AnimatePresence>
  );
};

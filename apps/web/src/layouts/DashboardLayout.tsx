import React from "react";

import { useRouter } from "next/router";

import { AnimatePresence, motion } from "framer-motion";

import { Header, HeaderProps } from "@/components/Header";

import { PrimaryLayout } from "./PrimaryLayout";

export type DashboardLayoutProps = {
  headerProps?: HeaderProps;
  children?: React.ReactNode;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  headerProps,
  children,
}) => {
  const router = useRouter();

  return (
    <PrimaryLayout>
      <Header {...headerProps} />
      <AnimatePresence
        exitBeforeEnter
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <motion.div
          key={router.route}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="min-h-screen-without-header transition-colors bg-gray-50 dark:bg-primary-dark py-6 px-2 md:px-0 md:py-8 max-w-screen-xl mx-auto"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </PrimaryLayout>
  );
};

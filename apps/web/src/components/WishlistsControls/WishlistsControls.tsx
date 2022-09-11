import React from "react";

import { Button } from "@wishlify/ui";

import { AnimatePresence, motion } from "framer-motion";

import { useSelectedWishlists } from "@/hooks/useSelectedWishlists";

export type WishlistsControlsProps = {
  onDelete: () => void;
  onCreateWishlist: () => void;
};

export const WishlistsControls: React.FC<WishlistsControlsProps> = ({
  onDelete,
  onCreateWishlist,
}) => {
  const selectedWishlists = useSelectedWishlists(
    (state) => state.selectedWishlists
  );

  const selectedWishlistsCount = selectedWishlists.length;

  return (
    <div className="flex gap-4 items-center">
      <AnimatePresence exitBeforeEnter>
        {selectedWishlistsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ type: "tween" }}
            className="flex items-center gap-4"
          >
            <Button color="red" onClick={onDelete}>
              Удалить
            </Button>
            <div className="bg-blue-100 text-blue-800 rounded-md px-2 py-1">
              <div className="flex gap-1 overflow-hidden">
                Выбрано:
                <AnimatePresence exitBeforeEnter initial={false}>
                  <motion.div
                    key={selectedWishlistsCount}
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    exit={{ y: -20 }}
                    transition={{ type: "tween" }}
                    className="w-[2ch] flex justify-end"
                  >
                    {selectedWishlistsCount}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Button className="w-full sm:w-auto" onClick={onCreateWishlist}>
        Создать вишлист
      </Button>
    </div>
  );
};

import React from "react";

import Image from "next/image";

import { Button, Panel } from "@wishlify/ui";

import { Product } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";

import { getFullImageUrl } from "@/utils/getFullImageUrl";

export type ProductSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | undefined;
  onDeleteProduct: (productId: string) => Promise<void>;
};

export const ProductSidebar: React.FC<ProductSidebarProps> = ({
  isOpen,
  product,
  onDeleteProduct,
}) => {
  const productImage = getFullImageUrl(product?.image ?? null);

  return (
    <AnimatePresence exitBeforeEnter>
      {isOpen && (
        <Panel
          as={motion.div}
          initial={{}}
          animate={{}}
          exit={{}}
          transition={{ type: "tween" }}
          className="sticky top-0 bottom-0 right-0 min-w-[300px]"
          size="small"
        >
          {product && (
            <div className="flex flex-col items-end">
              {productImage && (
                <div className="relative overflow-hidden rounded w-full h-full">
                  <Image
                    src={productImage}
                    alt={product.title}
                    width="100%"
                    height="100%"
                    layout="responsive"
                    objectFit="contain"
                  />
                </div>
              )}
              <h2 className="text-xl mt-2">{product?.title}</h2>
              <Button
                size="small"
                color="red"
                onClick={() => onDeleteProduct(product.id)}
                className="mt-2"
              >
                Delete product
              </Button>
            </div>
          )}
        </Panel>
      )}
    </AnimatePresence>
  );
};

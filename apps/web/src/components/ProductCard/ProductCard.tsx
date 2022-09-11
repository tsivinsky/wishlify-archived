import React from "react";

import { Panel } from "@wishlify/ui";

import { Product } from "@prisma/client";

export type ProductCardProps = {
  product: Product;
  className?: string;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
}) => {
  return (
    <Panel className={className}>
      <h2 className="dark:text-white/90">{product.title}</h2>
    </Panel>
  );
};

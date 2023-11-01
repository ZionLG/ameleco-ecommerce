import React from "react";
import NextImage from "next/image";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

import type { RouterOutputs } from "~/utils/api";

interface ProductCardProps {
  product: NonNullable<RouterOutputs["shop"]["productById"]>;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card shadow="sm" isPressable onPress={() => console.log("item pressed")}>
      <CardBody className="items-center  overflow-visible p-2">
        <Image
          as={NextImage}
          shadow="sm"
          radius="lg"
          width={250}
          height={250}
          alt={product.name}
          className="h-[140px]  object-contain"
          src={product.imageUrl}
        />
      </CardBody>
      <CardFooter className="text-small justify-between">
        <b>{product.name}</b>
        <p className="text-default-500">
          {Object.keys(product.price).map(function (key) {
            return product.price[key as keyof typeof product.price] + "$";
          })}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

import React from "react";
import NextImage from "next/image";
import Link from "next/link";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Spinner } from "@nextui-org/spinner";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Dot } from "lucide-react";

import type { RouterOutputs } from "~/utils/api";
import { ShouldShowPrice } from "~/utils/utils";

interface ProductCardProps {
  product: NonNullable<RouterOutputs["shop"]["productById"]>;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const session = useSessionContext();

  return (
    <Link
      href={`/shop/${encodeURIComponent(product.name)}`}
      className="w-fit justify-self-center"
    >
      <Card shadow="sm" isPressable className="h-full w-64">
        <CardBody className="items-center  gap-2 overflow-visible p-2">
          <Image
            as={NextImage}
            shadow="sm"
            radius="lg"
            width={300}
            height={250}
            alt={product.name}
            className="h-[140px]  border-1  object-contain"
            src={product.imageUrl}
          />
          <b>{product.name}</b>
        </CardBody>
        <CardFooter className=" flex-col items-start p-5 text-small">
          <div className=" flex">
            <span className="text-xl text-default-500 ">
              {Object.keys(product.price).map(function (key) {
                if (ShouldShowPrice(key, session))
                  return "$" + product.price[key as keyof typeof product.price];

                return <Spinner key={key} size="sm" />;
              })}
            </span>
            <div
              className={`flex items-center font-bold ${
                product.stock > 0 ? " text-green-600" : "text-gray-500"
              }`}
            >
              <Dot />
              {product.stock > 0 ? (
                <span>In stock</span>
              ) : (
                <span>Sold out</span>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;

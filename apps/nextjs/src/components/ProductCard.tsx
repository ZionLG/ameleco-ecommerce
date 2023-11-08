import React from "react";
import NextImage from "next/image";
import Link from "next/link";
import { Card, CardBody, CardFooter, Image, Spinner } from "@nextui-org/react";
import { useUser } from "@supabase/auth-helpers-react";
import { Dot } from "lucide-react";

import type { RouterOutputs } from "~/utils/api";

interface ProductCardProps {
  product: NonNullable<RouterOutputs["shop"]["productById"]>;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const user = useUser();

  return (
    <Link href={`/shop/${encodeURIComponent(product.name)}`}>
      <Card shadow="sm" isPressable onPress={() => console.log("item pressed")}>
        <CardBody className="items-center  overflow-visible p-2">
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
        </CardBody>
        <CardFooter className=" flex-col items-start p-5 text-small">
          <b>{product.name}</b>
          <div className=" flex">
            <span className="text-xl text-default-500 ">
              {Object.keys(product.price).map(function (key) {
                if (
                  key.toUpperCase() === user?.app_metadata.AMELECO_group ||
                  user == null
                )
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

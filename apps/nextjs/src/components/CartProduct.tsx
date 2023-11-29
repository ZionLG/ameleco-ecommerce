import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Spinner } from "@nextui-org/spinner";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { ShouldShowPrice } from "~/utils/utils";
import Quantity from "./Quantity";
import { Button } from "./ui/button";

interface CartProductProps {
  product: NonNullable<RouterOutputs["shop"]["getProduct"]>;
  startingQuantity: number;
  cartItemId: string;
}

const CartProduct = ({
  product,
  startingQuantity,
  cartItemId,
}: CartProductProps) => {
  const session = useSessionContext();

  const [quantity, setQuantity] = useState(startingQuantity);
  const utils = api.useUtils();
  const { mutate: removeItem } = api.shop.removeFromCart.useMutation({
    onSuccess: () => {
      void utils.shop.getCart.invalidate();
    },
  });

  return (
    <div className="flex gap-3">
      <Image
        alt={product.name}
        src={product.imageUrl}
        width={100}
        height={150}
      />

      <div className="flex flex-col gap-3">
        <span className="max-w-[12rem] text-xl font-semibold">
          {product.name}
        </span>
        <span className="text-xl font-semibold text-default-500 ">
          {Object.keys(product.price).map(function (key) {
            if (ShouldShowPrice(key, session))
              return (
                "$" +
                product.price[key as keyof typeof product.price] * quantity
              );

            return <Spinner key={key} size="sm" />;
          })}
        </span>
      </div>
      <div className="flex grow justify-end self-center">
        <div className="flex flex-col items-center gap-2">
          <Quantity
            stock={product.stock}
            setQuantity={setQuantity}
            quantity={quantity}
            startQuantity={startingQuantity}
            itemId={cartItemId}
            updateData={true}
          />
          <Button
            variant={"ghost"}
            onClick={() => removeItem({ itemId: cartItemId })}
          >
            Remove Item
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;

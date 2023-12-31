import React, { useState } from "react";
import Image from "next/image";
import { Spinner } from "@nextui-org/spinner";
import { useSessionContext } from "@supabase/auth-helpers-react";

import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { ShouldShowPrice } from "~/utils/utils";
import Quantity from "./Quantity";
import { Button } from "./ui/button";
import { TableCell, TableRow } from "./ui/table";

interface CartTableRowProps {
  product: NonNullable<RouterOutputs["shop"]["getProduct"]>;
  startingQuantity: number;
  cartItemId: string;
}
const CartTableRow = ({
  product,
  startingQuantity,
  cartItemId,
}: CartTableRowProps) => {
  const session = useSessionContext();

  const [quantity, setQuantity] = useState(startingQuantity);
  const utils = api.useUtils();
  const { mutate: removeItem } = api.shop.removeFromCart.useMutation({
    onSuccess: () => {
      void utils.shop.getCart.invalidate();
    },
  });
  return (
    <TableRow key={cartItemId}>
      <TableCell className="flex gap-3 font-medium">
        <Image
          alt={product.name}
          src={product.imageUrl}
          width={75}
          height={75}
        />
        <div className="flex flex-col gap-5">
          <span className="font-semibold">{product.name}</span>
          <span className="font-semibold">
            {Object.keys(product.price).map(function (key) {
              if (ShouldShowPrice(key, session))
                return "$" + product.price[key as keyof typeof product.price];

              return <Spinner key={key} size="sm" />;
            })}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
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
      </TableCell>
      <TableCell className="text-right">
        {Object.keys(product.price).map(function (key) {
          if (ShouldShowPrice(key, session))
            return (
              "$" + product.price[key as keyof typeof product.price] * quantity
            );

          return <Spinner key={key} size="sm" />;
        })}
      </TableCell>
    </TableRow>
  );
};

export default CartTableRow;

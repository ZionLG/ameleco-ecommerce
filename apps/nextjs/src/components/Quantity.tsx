import React, { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface QuantityProps {
  stock: number;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  updateData: boolean;
  itemId: string | undefined;
  startQuantity: number | undefined;
}
const Quantity = ({
  quantity,
  stock,
  setQuantity,
  updateData = false,
  itemId,
  startQuantity,
}: QuantityProps) => {
  const utils = api.useContext();
  const { mutate, isLoading } = api.shop.changeItemQuantity.useMutation({
    onSuccess: () => {
      void utils.shop.getCart.invalidate();
    },
  });

  return (
    <div className="flex">
      <Button
        disabled={isLoading}
        variant={"outline"}
        size={"icon"}
        className="rounded-none border border-r-0 p-2"
        onClick={() => {
          setQuantity((old) => {
            if (old > 1) {
              if (updateData && itemId) {
                mutate({ itemId: itemId, productQuantity: old - 1 });
              }
              return old - 1;
            }
            return old;
          });
        }}
      >
        <Minus />
      </Button>
      <Input
        type="number"
        className="w-14 rounded-none p-2 text-center text-lg focus-visible:ring-transparent"
        value={quantity}
        onBlur={(e) => {
          if (updateData && itemId) {
            if (Number.isNaN(e.target.valueAsNumber)) {
              mutate({ itemId: itemId, productQuantity: 1 });
              return;
            } else if (e.target.valueAsNumber > stock) {
              mutate({ itemId: itemId, productQuantity: stock });
              return;
            }

            if (startQuantity != e.target.valueAsNumber) {
              mutate({
                itemId: itemId,
                productQuantity: e.target.valueAsNumber,
              });
            }
          }
        }}
        disabled={isLoading}
        onChange={(e) => {
          if (Number.isNaN(e.target.valueAsNumber)) {
            setQuantity(1);
            return;
          } else if (e.target.valueAsNumber > stock) {
            setQuantity(stock);
            return;
          }

          setQuantity(e.target.valueAsNumber);
        }}
      />
      <Button
        variant={"outline"}
        className="rounded-none border-l-0  p-2"
        size={"icon"}
        disabled={isLoading}
        onClick={() => {
          setQuantity((old) => {
            if (old < stock) {
              if (updateData && itemId) {
                mutate({ itemId: itemId, productQuantity: old + 1 });
              }
              return old + 1;
            }

            return old;
          });
        }}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default Quantity;

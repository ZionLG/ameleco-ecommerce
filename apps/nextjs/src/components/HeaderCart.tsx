import React, { useEffect } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@nextui-org/react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { ShoppingCart } from "lucide-react";

import { api } from "~/utils/api";
import { cn, ShouldShowPrice } from "~/utils/utils";
import CartProduct from "./CartProduct";
import { Button, buttonVariants } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

const HeaderCart = () => {
  const session = useSessionContext();

  const [total, setTotal] = React.useState(0);

  const [isOpen, setIsOpen] = React.useState(false);
  const { data, isLoading, isSuccess } = api.shop.getCart.useQuery(undefined, {
    enabled: !!session.session,
  });

  useEffect(() => {
    if (data) {
      let localTotal = 0;
      data.items.forEach((item) => {
        const price = Object.keys(item.product.price).map(function (key) {
          if (ShouldShowPrice(key, session))
            return item.product.price[key as keyof typeof item.product.price];
        })[0];

        if (price) {
          localTotal += price * item.quantity;
        }
      });

      setTotal(localTotal);
    }
  }, [
    data,
    session,
    session.isLoading,
    session.session?.user.app_metadata.AMELECO_group,
  ]);
  return (
    <Popover
      shouldBlockScroll
      placement="bottom"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      classNames={{ arrow: "w-5 h-5" }}
    >
      <PopoverTrigger>
        <ShoppingCart strokeWidth={1} size={36} />
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2 ">
          {(data === null || isLoading) && <Spinner />}
          {data && data.items.length === 0 && (
            <div className="flex flex-col items-center justify-center pt-10">
              <ShoppingCart strokeWidth={1} size={72} />
              <span>Your cart is empty</span>
              <Link
                href={`/shop`}
                className={`${cn(buttonVariants())} mt-10 px-24`}
                onClick={() => setIsOpen(false)}
              >
                Shop our products
              </Link>
            </div>
          )}
          {data && isSuccess && data.items && data.items.length > 0 && (
            <div className="flex flex-col gap-5">
              <div className="p-5">
                <ScrollArea className="h-64 max-h-64 pr-5">
                  {data.items.map((item, i) => (
                    <div key={item.id}>
                      <CartProduct
                        product={item.product}
                        startingQuantity={item.quantity}
                        cartItemId={item.id}
                      />
                      {i !== data.items.length - 1 && (
                        <Separator className="my-5" />
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </div>
              <Separator />
              <div className="flex justify-between text-lg ">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <div className="flex gap-5">
                <Link
                  href={"/cart"}
                  className={`${cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                  )} grow rounded-sm py-7`}
                  onClick={() => setIsOpen(false)}
                >
                  View Cart
                </Link>
                <Link
                  href={"/cart"}
                  className={`${cn(
                    buttonVariants({ variant: "destructive", size: "lg" }),
                  )} grow rounded-sm py-7`}
                  onClick={() => setIsOpen(false)}
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HeaderCart;

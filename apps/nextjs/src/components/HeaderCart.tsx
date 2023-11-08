import React, { useEffect } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@nextui-org/react";
import { ShoppingCart } from "lucide-react";

import { api } from "~/utils/api";
import { cn } from "~/utils/utils";
import { buttonVariants } from "./ui/button";

const HeaderCart = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const cart = api.shop.getCart.useQuery();
  const utils = api.useContext();

  const { mutate: createCart } = api.shop.createCart.useMutation({
    onSuccess: () => {
      void utils.shop.getCart.invalidate();
    },
  });

  useEffect(() => {
    if (cart.data === null) {
      createCart();
    }
  }, [cart.data, createCart]);
  return (
    <Popover
      shouldBlockScroll
      placement="bottom"
      showArrow={true}
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      classNames={{ arrow: "w-5 h-5" }}
    >
      <PopoverTrigger>
        <ShoppingCart strokeWidth={1} size={36} />
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2 ">
          {(cart.data === null || cart.isLoading) && <Spinner />}
          {cart.data != null && cart.data.items.length === 0 && (
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
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HeaderCart;

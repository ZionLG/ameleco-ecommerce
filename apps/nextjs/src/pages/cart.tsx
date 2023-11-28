import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { api } from "~/utils/api";
import { ShouldShowPrice } from "~/utils/utils";
import CartTableRow from "~/components/CartTableRow";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const CartPage = () => {
  const session = useSessionContext();
  const router = useRouter();
  const { data } = api.shop.getCart.useQuery(undefined, {
    enabled: !!session,
  });
  const { mutate, isLoading } = api.shop.createPaymentLink.useMutation({
    onSuccess: async (data) => {
      if (data) {
        void window.open(data);
      }
    },
  });

  const [total, setTotal] = React.useState(0);
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
    session.isLoading,
    session.session?.user?.app_metadata.AMELECO_group,
  ]);
  useEffect(() => {
    if (!session.isLoading && session.session == null) void router.push("/");
  }, [router, session]);

  return (
    <main className="flex flex-col gap-5 bg-secondary py-10 lg:px-16">
      <span className="text-center text-xl font-semibold lg:text-start">
        My cart
      </span>
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
        <div className="grow bg-background p-5">
          <Table className="bg-background">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right md:w-[100px]">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.map((item) => (
                <CartTableRow
                  cartItemId={item.id}
                  product={item.product}
                  startingQuantity={item.quantity}
                  key={item.id}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex h-fit w-96 flex-col bg-background p-5">
          <div className="flex justify-between font-semibold ">
            <span>Total</span>
            <span>${total}</span>
          </div>
          <Separator className="mt-8" />
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Order instructions</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <span className="mt-8 text-sm">
            Taxes and shipping calculated at checkout
          </span>
          <Button
            disabled={isLoading}
            onClick={() => {
              mutate();
            }}
            className="mt-5 w-full rounded-sm py-8"
          >
            Checkout
          </Button>
        </div>
      </div>
    </main>
  );
};

export default CartPage;

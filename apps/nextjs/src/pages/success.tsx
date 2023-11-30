import React from "react";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const Success = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const { data } = api.shop.getCheckoutSession.useQuery(
    {
      session_id: session_id as string,
    },
    {
      enabled: session_id != undefined,
    },
  );
  if (data)
    return (
      <main className="container space-y-8">
        <h1 className="text-center text-5xl font-bold text-primary">
          Thank you for your purchase
        </h1>
        <span className="block">Total of: ${data.total}</span>
        <span className="block">
          Session Creation Date:{" "}
          {new Date(data.sessionCreationDate * 1000).toLocaleString()}
        </span>
        <Table className="bg-background">
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Item Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.products.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="flex gap-3 font-medium">
                  <div className="flex flex-col gap-5">
                    <span className="font-semibold">{item.name}</span>
                    <span className="font-semibold">${item.unit_amount}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-center gap-2">
                    {item.quantity}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  ${item.unit_amount * item.quantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    );
};

export default Success;

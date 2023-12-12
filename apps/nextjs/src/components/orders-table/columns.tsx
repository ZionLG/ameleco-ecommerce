import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import { cn } from "~/utils/utils";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DataTableColumnHeader } from "../ui/generic-table/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
//import { labels priorities, statuses } from "./data/data";
import type { orderSchema } from "./data/schema";

const columnHelper = createColumnHelper<orderSchema>();

export const columns: ColumnDef<orderSchema>[] = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor((row) => `${row.user.firstName} ${row.user.lastName}`, {
    id: "fullName",
    cell: (info) => <span>{info.getValue()}</span>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    enableSorting: true,
    enableHiding: true,
  }) as ColumnDef<orderSchema>,

  columnHelper.accessor(
    (row) => {
      return {
        email: row.user.email,
        isStaff: row.appMetadata.AMELECO_is_staff,
      };
    },
    {
      id: "email",

      cell: (info) => (
        <div className="flex space-x-2">
          {info.getValue().isStaff && <Badge variant="outline">Staff</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {info.getValue().email}
          </span>
        </div>
      ),

      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      enableSorting: true,
      enableHiding: true,
    },
  ) as ColumnDef<orderSchema>,
  columnHelper.accessor("user.phone", {
    id: "phone",
    cell: (info) => <span>{info.getValue()}</span>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    enableSorting: false,
    enableHiding: true,
  }) as ColumnDef<orderSchema>,
  columnHelper.accessor("address", {
    cell: (info) => (
      <div className="flex flex-col gap-1">
        <span>{info.getValue()?.city}</span>
        <span>{info.getValue()?.line1}</span>
        <span>{info.getValue()?.line2}</span>
        <span>{info.getValue()?.postal_code}</span>
      </div>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    enableSorting: false,
    enableHiding: true,
  }) as ColumnDef<orderSchema>,

  columnHelper.accessor("total", {
    cell: (info) => <span>${(info.getValue() ?? 0) / 100}</span>,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    enableSorting: false,
    enableHiding: true,
  }) as ColumnDef<orderSchema>,
  columnHelper.accessor(
    (row) => {
      return { hosted: row.hosted_invoice_url, pdf: row.invoice_pdf };
    },
    {
      id: "Invoice",
      cell: (info) => (
        <div className="flex flex-col gap-2">
          <a
            className={`${cn(buttonVariants({ variant: "link" }))} `}
            href={info.getValue().hosted ?? ""}
          >
            Hosted Link
          </a>
          <a
            className={`${cn(buttonVariants({ variant: "link" }))} `}
            href={info.getValue().pdf ?? ""}
          >
            PDF Link
          </a>
        </div>
      ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Invoice" />
      ),
      enableSorting: false,
      enableHiding: true,
    },
  ) as ColumnDef<orderSchema>,

  columnHelper.accessor("sessionId", {
    id: "Items",
    cell: (info) => (
      <Link
        className={`${cn(buttonVariants({ variant: "link" }))} `}
        href={`/success?session_id=${info.getValue()}`}
      >
        Items
      </Link>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items" />
    ),
    enableSorting: false,
    enableHiding: true,
  }) as ColumnDef<orderSchema>,
  columnHelper.accessor("payment_status", {
    id: "paymentStatus",
    cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Status" />
    ),
    enableSorting: false,
    enableHiding: true,
  }) as ColumnDef<orderSchema>,

  columnHelper.accessor("createdAt", {
    cell: (info) => <span>{info.getValue().toLocaleString()}</span>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    enableSorting: true,
    enableHiding: true,
  }) as ColumnDef<orderSchema>,

  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const status = statuses.find(
  //       (status) => status.value === row.getValue("status"),
  //     );

  //     if (!status) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {status.icon && (
  //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{status.label}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  // {
  //   accessorKey: "priority",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Priority" />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue("priority"),
  //     );

  //     if (!priority) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex items-center">
  //         {priority.icon && (
  //           <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{priority.label}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

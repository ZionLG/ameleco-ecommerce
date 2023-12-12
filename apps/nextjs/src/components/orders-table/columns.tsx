import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "../ui/badge";
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
    cell: (info) => <span>{info.getValue()}</span>,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
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

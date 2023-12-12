import React from "react";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import type { z } from "zod";

import type {
  filtersStateSchemaUsers,
  sortStateSchemaUsers,
} from "@ameleco/api/src/schemas";

import { api } from "~/utils/api";
import DashboardLayout from "~/components/DashboardLayout";
import { DataTableToolbar } from "~/components/user-table/data-table-toolbar";
import { DataTable } from "../../components/ui/generic-table/data-table";
import { columns } from "../../components/user-table/columns";

const sidebarNavItems = [
  {
    title: "Users",
    href: "/staff/users",
  },
  {
    title: "Orders",
    href: "/staff/orders",
  },
];

const Users = () => {
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );
  const { data, isFetching } = api.auth.getUsers.useQuery(
    {
      take: pageSize,
      skip: pageIndex * pageSize,
      filter: columnFilters as z.infer<typeof filtersStateSchemaUsers>,
      sort: sorting as z.infer<typeof sortStateSchemaUsers>,
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <DashboardLayout items={sidebarNavItems}>
      <DataTable
        Toolbar={DataTableToolbar}
        data={{
          isLoading: isFetching,
          rows: data?.data,
          pageCount: Math.ceil((data?.count ?? 1) / pageSize),
          pagination: pagination,
          setPagination: setPagination,
          initialVisibility: {
            businessType: false,
            additionalInformation: false,
            companyName: false,
          },
          columnFilters: columnFilters,
          setColumnFilters: setColumnFilters,
          sorting: sorting,
          setSorting: setSorting,
        }}
        columns={columns}
      />
    </DashboardLayout>
  );
};

export default Users;

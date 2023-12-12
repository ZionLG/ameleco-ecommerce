import * as React from "react";
import { useEffect } from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { DataTableToolbarProps } from "../../user-table/data-table-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  Toolbar: React.ComponentType<DataTableToolbarProps<TData>>;
  data: {
    isLoading: boolean;
    rows: TData[] | undefined;
    pageCount: number | undefined;
    pagination: {
      pageIndex: number;
      pageSize: number;
    };
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    initialVisibility: VisibilityState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  };
}

export function DataTable<TData, TValue>({
  columns,
  Toolbar,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(data.initialVisibility);

  const defaultData = React.useMemo(() => [], []);

  const table = useReactTable({
    data: data.rows ?? defaultData,
    columns,
    pageCount: data.pageCount ?? -1,
    state: {
      pagination: data.pagination,
      sorting: data.sorting,
      columnVisibility,
      rowSelection,
      columnFilters: data.columnFilters,
    },
    onPaginationChange: data.setPagination,
    onSortingChange: data.setSorting,

    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: data.setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    debugTable: true,
  });

  return (
    <div className="space-y-4">
      <Toolbar table={table} isLoading={data.isLoading} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

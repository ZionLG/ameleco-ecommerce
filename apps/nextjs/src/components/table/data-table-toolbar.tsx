import { Spinner } from "@nextui-org/react";
import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import {
  BusinessTypeData,
  GroupsData,
  OccupationData,
  PurchaseFrequencyData,
} from "./data/data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  isLoading: boolean;
}

export function DataTableToolbar<TData>({
  table,
  isLoading,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter By Name..."
          value={
            (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("fullName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px]"
        />
        <Input
          placeholder="Filter By Email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px]"
        />
        <Input
          placeholder="Filter By Phone..."
          value={(table.getColumn("phone")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("phone")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px]"
        />
        {table.getColumn("userGroup") && (
          <DataTableFacetedFilter
            column={table.getColumn("userGroup")}
            title="Groups"
            options={GroupsData}
          />
        )}
        {table.getColumn("occupation") && (
          <DataTableFacetedFilter
            column={table.getColumn("occupation")}
            title="Occupation"
            options={OccupationData}
          />
        )}
        {table.getColumn("purchaseFrequency") && (
          <DataTableFacetedFilter
            column={table.getColumn("purchaseFrequency")}
            title="Purchase Frequency"
            options={PurchaseFrequencyData}
          />
        )}
        {table.getColumn("businessType") && (
          <DataTableFacetedFilter
            column={table.getColumn("businessType")}
            title="Business Type"
            options={BusinessTypeData}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-5">
        {isLoading && <Spinner size="sm" />}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import type { Groups } from "@ameleco/db";

import { api } from "~/utils/api";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { GroupsData } from "./data/data";
import type { userSchema } from "./data/schema";

interface DataTableRowActionsProps {
  row: Row<userSchema>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const utils = api.useUtils();
  const { mutate, isLoading } = api.auth.updateUserGroup.useMutation({
    onSuccess: () => {
      void utils.auth.getUsers.invalidate();
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Group</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={row.getValue("userGroup")}>
              {GroupsData.map((group) => (
                <DropdownMenuRadioItem
                  key={group.value}
                  value={group.value}
                  onClick={() => {
                    if (!isLoading) {
                      mutate({
                        newGroup: group.value as Groups,
                        userId: row.original.userId,
                      });
                    }
                  }}
                >
                  {group.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          Delete User
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

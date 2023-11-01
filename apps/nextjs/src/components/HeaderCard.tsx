import type { ComponentType } from "react";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { categories } from "./ProductSearch";

interface BranchData {
  data: string;
  branch: string;
}

interface HeaderCardProps {
  Icon: LucideIcon;
  titleText: string;
  branchData: BranchData[];
}
const HeaderCard = ({ branchData, Icon, titleText }: HeaderCardProps) => {
  const [selectedBranch, setSelectedBranch] = useState<BranchData>(
    branchData[0] ? branchData[0] : ({ branch: "", data: "" } as BranchData),
  );
  console.log(selectedBranch);
  return (
    <div className="flex items-center gap-3 p-2">
      <Icon
        className="text-gray-500 dark:text-white "
        strokeWidth={1.3}
        size={48}
      />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-blue-400">{titleText}</span>
        <span className="text-sm font-bold text-blue-900">
          {selectedBranch.branch}
        </span>
        <span className="whitespace-pre-line text-sm font-extrabold text-blue-900">
          {selectedBranch.data}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex cursor-pointer items-center gap-1">
              <span className="text-sm underline">Change Branch</span>
              <ChevronDown className=" h-4 w-4 opacity-50" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit">
            <DropdownMenuRadioGroup
              value={selectedBranch.branch}
              onValueChange={(valueBranch) => {
                const pickedData = branchData.find(
                  (value) => value.branch === valueBranch,
                );
                if (pickedData) {
                  setSelectedBranch(pickedData);
                }
              }}
            >
              {branchData.map((branch) => (
                <DropdownMenuRadioItem
                  key={branch.branch}
                  value={branch.branch}
                >
                  {branch.branch}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HeaderCard;

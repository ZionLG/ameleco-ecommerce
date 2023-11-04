import React from "react";
import { ChevronDown } from "lucide-react";

import { Branch } from "~/components/Branches";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const ChangeBranch = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-1">
          <span className="text-sm underline">Change Branch</span>
          <ChevronDown className=" h-4 w-4 opacity-50" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        <DropdownMenuRadioGroup
          value={Branch.value}
          onValueChange={(valueBranch) => {
            console.log(valueBranch);
            Branch.value = valueBranch as
              | "Richmond Branch"
              | "Burnaby Branch"
              | "Port Coquitlam Branch";
            console.log(Branch.value);
          }}
        >
          <DropdownMenuRadioItem value={"Richmond Branch"}>
            Richmond Branch
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={"Burnaby Branch"}>
            Burnaby Branch
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={"Port Coquitlam Branch"}>
            Port Coquitlam Branch
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChangeBranch;

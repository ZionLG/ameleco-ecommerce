import React from "react";
import type { LucideIcon } from "lucide-react";

import { Branch } from "./Branches";

interface BranchData {
  data: string;
  branch: "Richmond Branch" | "Burnaby Branch" | "Port Coquitlam Branch";
}

interface HeaderCardProps {
  Icon: LucideIcon;
  titleText: string;
  branchData: BranchData[];
}
const HeaderCard = ({ branchData, Icon, titleText }: HeaderCardProps) => {
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
          {branchData.find((data) => data.branch == Branch.value)!.branch}
        </span>
        <span className="whitespace-pre-line text-sm font-extrabold text-blue-900">
          {branchData.find((data) => data.branch == Branch.value)!.data}
        </span>
      </div>
    </div>
  );
};

export default HeaderCard;

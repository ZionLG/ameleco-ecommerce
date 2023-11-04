import React from "react";
import { signal } from "@preact/signals-react";
import { Clock5, MapPin, PhoneCall } from "lucide-react";

import ChangeBranch from "./ChangeBranch";
import HeaderCard from "./HeaderCard";

export const Branch = signal(
  "Richmond Branch" as
    | "Richmond Branch"
    | "Burnaby Branch"
    | "Port Coquitlam Branch",
);
const Branches = () => {
  return (
    <div className="invisible hidden items-center 3xl:visible 3xl:flex 3xl:flex-col">
      <span>{Branch.value}</span>
      <ChangeBranch />
      <div className="flex">
        <HeaderCard
          Icon={PhoneCall}
          titleText={"Call Us Today"}
          branchData={[
            {
              branch: "Richmond Branch",
              data: "(778) 295-2570",
            },
            {
              branch: "Burnaby Branch",
              data: "(604) 570-0867",
            },
            {
              branch: "Port Coquitlam Branch",
              data: "(778) 285-3999",
            },
          ]}
        />
        <HeaderCard
          Icon={Clock5}
          titleText={"When We're Open"}
          branchData={[
            {
              branch: "Richmond Branch",
              data: "7:00 am - 5:00 pm",
            },
            {
              branch: "Burnaby Branch",
              data: "7:00 am - 5:00 pm",
            },
            {
              branch: "Port Coquitlam Branch",
              data: "7:00 am - 5:00 pm",
            },
          ]}
        />
        <HeaderCard
          Icon={MapPin}
          titleText={"Where We At"}
          branchData={[
            {
              branch: "Richmond Branch",
              data: "Unit #3 - 4 12331 Bridgeport Road\nRichmond, BC. V6V 1J4",
            },
            {
              branch: "Burnaby Branch",
              data: "4012 Myrtle Street\nBurnaby, BC.  V5C 4G2",
            },
            {
              branch: "Port Coquitlam Branch",
              data: "Unit #420 1952 Kingsway Avenue\nPort Coquitlam, BC.  V3C 1S5",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Branches;

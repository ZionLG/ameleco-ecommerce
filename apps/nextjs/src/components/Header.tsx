import React from "react";
import Link from "next/link";
import { Clock5, MapPin, PhoneCall, ShoppingCart } from "lucide-react";

import { api } from "~/utils/api";
import { cn } from "~/utils/utils";
import HeaderAuth from "./HeaderAuth";
import HeaderCard from "./HeaderCard";
import ProductSearch from "./ProductSearch";
import { buttonVariants } from "./ui/button";

const MENU_LIST = [
  { text: "Home", href: "/" },
  { text: "Shop", href: "/shop" },
  { text: "Projects", href: "/projects" },
  { text: "Career", href: "/career" },
  { text: "Contact Us", href: "/contact" },
];

const Header = () => {
  const { data, error } = api.shop.allProducts.useQuery();

  return (
    <header className="flex flex-col gap-3 p-5">
      <div className="flex items-center gap-5">
        <span className="text-8xl font-bold uppercase italic text-[#0070C0]">
          AMELECO
        </span>

        <div className="grow">
          <ProductSearch data={data ?? []} />
        </div>
        <div className="3xl:flex hidden">
          <HeaderCard
            Icon={PhoneCall}
            titleText={"Call Us Today"}
            branchData={[
              { branch: "Richmond Branch", data: "(778) 295-2570" },
              { branch: "Burnaby Branch", data: "(604) 570-0867" },
              { branch: "Port Coquitlam Branch", data: "(778) 285-3999" },
            ]}
          />
          <HeaderCard
            Icon={Clock5}
            titleText={"When We're Open"}
            branchData={[
              {
                branch: "Richmond & Burnaby Branches",
                data: "7:00 am - 5:00 pm",
              },
              { branch: "Port Coquitlam Branch", data: "am - pm" },
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
      <nav className="flex items-center justify-center gap-3">
        {MENU_LIST.map((item) => (
          <Link
            key={item.text}
            href={item.href}
            className={`${cn(
              buttonVariants({ variant: "link" }),
            )} bg-secondary w-36 font-semibold`}
          >
            {item.text}
          </Link>
        ))}

        <HeaderAuth />
        <ShoppingCart strokeWidth={1} size={36} className="justify-self-end" />
      </nav>
    </header>
  );
};

export default Header;

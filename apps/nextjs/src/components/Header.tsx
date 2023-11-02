import React from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { Clock5, MapPin, Menu, PhoneCall, ShoppingCart } from "lucide-react";

import { api } from "~/utils/api";
import { cn } from "~/utils/utils";
import HeaderAuth from "./HeaderAuth";
import HeaderCard from "./HeaderCard";
import HeaderCart from "./HeaderCart";
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
      <div className="flex items-center justify-between gap-5 md:justify-center lg:items-baseline">
        <span className=" text-6xl  font-bold uppercase italic text-[#0070C0]  lg:text-8xl">
          AMELECO
        </span>
        <Button
          isIconOnly
          variant="light"
          aria-label="Toggle Menu"
          className="justify-self-end md:hidden"
        >
          <Menu />
        </Button>
        <div className="invisible hidden grow lg:visible lg:inline-block">
          <ProductSearch data={data ?? []} />
        </div>
        <div className="invisible hidden 3xl:visible 3xl:flex">
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
      <div className="inline-block grow lg:invisible lg:hidden">
        <ProductSearch data={data ?? []} />
      </div>
      <nav className="invisible hidden items-center justify-center gap-3 md:visible md:flex">
        {MENU_LIST.map((item) => (
          <Link
            key={item.text}
            href={item.href}
            className={`${cn(
              buttonVariants({ variant: "link" }),
            )} w-36 bg-secondary font-semibold`}
          >
            {item.text}
          </Link>
        ))}

        <HeaderAuth />
        <HeaderCart />
      </nav>
    </header>
  );
};

export default Header;

import React from "react";
import Link from "next/link";

import { api } from "~/utils/api";
import { cn } from "~/utils/utils";
import Branches from "./Branches";
import HeaderAuth from "./HeaderAuth";
import HeaderCart from "./HeaderCart";
import ProductSearch from "./ProductSearch";
import Sidebar from "./Sidebar";
import { buttonVariants } from "./ui/button";

const MENU_LIST = [
  { text: "Home", href: "/" },
  { text: "Shop", href: "/shop" },
  { text: "Projects", href: "/projects" },
  { text: "Career", href: "/career" },
  { text: "Contact Us", href: "/contact" },
];

const Header = () => {
  const { data } = api.shop.allProducts.useQuery();

  return (
    <header className="sticky top-0 z-50 flex flex-col gap-3 bg-background p-5">
      <div className="flex items-center justify-between gap-5 md:justify-center lg:items-center">
        <span className=" text-5xl  font-bold uppercase italic text-[#0070C0]  lg:text-8xl">
          AMELECO
        </span>
        <Sidebar MENU_LIST={MENU_LIST} />
        <div className="invisible hidden grow lg:visible lg:inline-block">
          <ProductSearch data={data ?? []} />
        </div>
        <Branches />
      </div>
      <div className="inline-block grow lg:invisible lg:hidden">
        <ProductSearch data={data ?? []} />
      </div>
      <nav className="container invisible hidden items-center gap-3 md:visible md:flex ">
        <div className="flex  grow justify-center gap-3">
          {MENU_LIST.map((item) => (
            <Link
              key={item.text}
              href={item.href}
              className={`${cn(
                buttonVariants({ variant: "link" }),
              )} w-24 bg-secondary font-semibold lg:w-36`}
            >
              {item.text}
            </Link>
          ))}
        </div>

        <div className="flex  justify-end gap-2">
          <HeaderAuth />
          <HeaderCart />
        </div>
      </nav>
    </header>
  );
};

export default Header;

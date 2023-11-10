import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useUser } from "@supabase/auth-helpers-react";
import { ShoppingCart, UserCircle2 } from "lucide-react";

import { cn } from "~/utils/utils";
import Branches from "./Branches";
import ProductSearch from "./ProductSearch";
import Sidebar from "./Sidebar";
import { buttonVariants } from "./ui/button";

const DynamicHeaderAuth = dynamic(() => import("./HeaderAuth"), {
  loading: () => <UserCircle2 strokeWidth={1} size={36} />,
});
const DynamicHeaderCart = dynamic(() => import("./HeaderCart"), {
  loading: () => <ShoppingCart strokeWidth={1} size={36} />,
});

const MENU_LIST = [
  { text: "Home", href: "/" },
  { text: "Shop", href: "/shop" },
  { text: "Projects", href: "/projects" },
  { text: "Career", href: "/career" },
  { text: "Contact Us", href: "/contact-us" },
];

const Header = () => {
  const user = useUser();

  return (
    <header className="sticky top-0 z-50 flex flex-col gap-3 bg-background p-5">
      <div className="flex items-center justify-between gap-5 md:justify-center lg:items-center">
        <span className=" text-5xl  font-bold uppercase italic text-[#0070C0]  lg:text-8xl">
          AMELECO
        </span>
        <Sidebar MENU_LIST={MENU_LIST} />
        <div className="invisible hidden grow lg:visible lg:inline-block">
          <ProductSearch />
        </div>
        <Branches />
      </div>
      <div className="inline-block grow lg:invisible lg:hidden">
        <ProductSearch />
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
          <DynamicHeaderAuth />
          {user && <DynamicHeaderCart />}
        </div>
      </nav>
    </header>
  );
};

export default Header;

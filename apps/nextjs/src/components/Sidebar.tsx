/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from "react";
import Link from "next/link";
import { Button, cn } from "@nextui-org/react";
import { Menu, X } from "lucide-react";

import { buttonVariants } from "./ui/button";

const Sidebar = ({
  MENU_LIST,
}: {
  MENU_LIST: {
    text: string;
    href: string;
  }[];
}) => {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <>
      <Button
        isIconOnly
        variant="light"
        aria-label="Toggle Menu"
        className="justify-self-end md:hidden"
        onClick={() => setMobileNav(() => !mobileNav)}
      >
        <Menu />
      </Button>
      <div
        onClick={() => setMobileNav(() => !mobileNav)}
        className={`bg-black duration-700 ease-in-out ${
          mobileNav ? "translate-x-0 " : "-translate-x-full"
        } fixed right-0 top-0 z-50 h-full w-full bg-opacity-30`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative text-black duration-500 ease-in-out ${
            mobileNav ? "translate-x-0 " : "-translate-x-full"
          } left-0 h-full w-72 bg-white`}
        >
          <div className="flex h-full flex-col gap-8 p-5">
            <div className="flex h-fit items-center gap-5">
              <X
                strokeWidth={2}
                size={36}
                onClick={() => {
                  setMobileNav(() => !mobileNav);
                }}
                className="cursor-pointer"
              />
              <span className="text-2xl font-bold">Ameleco</span>
            </div>
            <div className={`flex flex-col  gap-5`}>
              {MENU_LIST.map((navItem) => (
                <Link
                  className={`flex items-center gap-1  p-3 ${cn(
                    buttonVariants({ variant: "outline" }),
                  )} `}
                  href={navItem.href}
                  key={navItem.text}
                  onClick={() => {
                    setMobileNav(() => !mobileNav);
                  }}
                >
                  {navItem.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

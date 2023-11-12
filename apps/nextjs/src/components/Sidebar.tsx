import React, { useState } from "react";
import Link from "next/link";
import { Button, cn } from "@nextui-org/react";
import { Menu, X } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
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
    <div className="justify-self-end">
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="mb-10">
            <SheetTitle>Ameleco</SheetTitle>
          </SheetHeader>
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
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;

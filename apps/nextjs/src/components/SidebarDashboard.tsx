import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronDown, Dot } from "lucide-react";

import { cn } from "~/utils/utils";
import { buttonVariants } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface SidebarDashboardProps {
  items: {
    href: string;
    title: string;
  }[];
}
const SidebarDashboard = ({ items }: SidebarDashboardProps) => {
  const router = useRouter();
  console.log(items);
  return (
    <>
      <div className="invisible hidden h-fit w-64 flex-col items-start rounded-lg bg-background py-5 shadow-lg lg:visible lg:flex">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={` ${cn(
              buttonVariants({
                variant: "link",
                className: "font-semibold",
              }),
              { "text-primary-300": item.href === router.pathname },
            )}`}
          >
            <Dot />
            {item.title}
          </Link>
        ))}
      </div>
      <div className="visible  rounded-lg bg-background  shadow-lg lg:invisible lg:hidden">
        <Sheet>
          <SheetTrigger className="flex w-full items-center justify-between p-5">
            <span>
              {items.filter((item) => item.href === router.pathname)[0]?.title}
            </span>
            <ChevronDown className="h-5 w-5 shrink-0 " />
          </SheetTrigger>
          <SheetContent side={"bottom"}>
            <SheetHeader>
              <SheetTitle>My Account</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col">
              {items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={` ${cn(
                    buttonVariants({
                      variant: "link",
                      className: "font-semibold",
                    }),
                    { "text-primary-300": item.href === router.pathname },
                  )}`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default SidebarDashboard;

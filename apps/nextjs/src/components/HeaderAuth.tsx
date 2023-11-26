import React from "react";
import Link from "next/link";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { FormInput, LogIn, LogOut, UserCircle2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const HeaderAuth = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const user = useUser();
  const { auth } = useSupabaseClient();
  return (
    <DropdownMenu open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger className="outline-none">
        <UserCircle2 strokeWidth={1} size={36} opacity={isOpen ? 0.5 : 1} />
      </DropdownMenuTrigger>
      {user ? (
        <DropdownMenuContent>
          <DropdownMenuLabel>
            {user.user_metadata.first_name} {user.user_metadata.last_name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={"/account"}>Profile</Link>
          </DropdownMenuItem>
          {user.app_metadata.AMELECO_is_staff ? (
            <DropdownMenuItem>Users Dashboard</DropdownMenuItem>
          ) : null}

          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await auth.signOut();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent>
          <DropdownMenuLabel>Guest</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <Link
              href={`/login`}
              className="flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="mr-2 h-4 w-4" />
              <span>Log In</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/register`}
              className="flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <FormInput className="mr-2 h-4 w-4" />
              <span>Register</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

{
  /* <Popover
  placement="bottom"
  showArrow={true}
  isOpen={isOpen}
  onOpenChange={(open) => setIsOpen(open)}
>
  <PopoverTrigger>
    <UserCircle2 strokeWidth={1} size={36} />
  </PopoverTrigger>
  <PopoverContent>
    <div className="flex flex-col  px-1 py-2">
      {user ? (
        <>
          <div>{user.user_metadata.fullName}</div>
          <Button
            onClick={async () => {
              await auth.signOut();
            }}
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <div className="text-small font-bold">Guest</div>
          <div className="text-small">Lorem ipsum dolor sit amet.</div>
          <div className="mt-2 flex items-center">
            <Link
              href={`/register`}
              className={`${cn(buttonVariants({ size: "sm" }))} `}
              onClick={() => setIsOpen(false)}
            >
              Register
            </Link>
            <Dot className="mx-2" />
            <Link
              href={`/login`}
              className={`${cn(buttonVariants({ size: "sm" }))} `}
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        </>
      )}
    </div>
  </PopoverContent>
</Popover>; */
}
export default HeaderAuth;

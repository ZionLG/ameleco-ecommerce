import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn, Spinner } from "@nextui-org/react";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { ChevronDown, Dot } from "lucide-react";

import { api } from "~/utils/api";
import ChangeEmailForm from "~/components/ChangeEmailForm";
import ChangePasswordForm from "~/components/ChangePasswordForm";
import ProfileForm from "~/components/ProfileForm";
import { buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

const Profile = () => {
  const session = useSessionContext();
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { data, isSuccess } = api.auth.me.useQuery();

  useEffect(() => {
    if (!session.isLoading && session.session == null) void router.push("/");
  }, [router, session]);

  return (
    <main className="container flex flex-col gap-10 md:flex-row lg:p-10">
      <div className="invisible hidden h-fit w-64 flex-col items-start rounded-lg bg-background py-5 shadow-lg md:visible md:flex">
        <Link
          href={"/account"}
          className={` ${cn(
            buttonVariants({
              variant: "link",
              className: "font-semibold text-primary-300 ",
            }),
          )}`}
        >
          <Dot />
          My Profile
        </Link>
        <Link
          href={"/account/orders"}
          className={` ${cn(
            buttonVariants({
              variant: "link",
              className: " font-semibold ",
            }),
          )} `}
        >
          <Dot />
          My Orders
        </Link>
      </div>
      <div className="visible  rounded-lg bg-background  shadow-lg md:invisible md:hidden">
        <Sheet>
          <SheetTrigger className="flex w-full items-center justify-between p-5">
            <span>My Profile</span>
            <ChevronDown className="h-5 w-5 shrink-0 " />
          </SheetTrigger>
          <SheetContent side={"bottom"}>
            <SheetHeader>
              <SheetTitle>My Account</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col">
              <Link
                href={"/account"}
                className={` ${cn(
                  buttonVariants({
                    variant: "link",
                    className: "font-semibold text-primary-300 ",
                  }),
                )}`}
              >
                My Profile
              </Link>
              <Link
                href={"/shop"}
                className={` ${cn(
                  buttonVariants({
                    variant: "link",
                    className: " font-semibold ",
                  }),
                )} `}
              >
                My Orders
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex h-fit w-full flex-col rounded-lg bg-background p-5 shadow-lg">
        <span className="text-2xl font-bold">My Profile</span>
        <Separator className="my-2" />
        {data && isSuccess && session.session ? (
          <div className="flex flex-col gap-10">
            <span>
              You are in the {session.session.user.app_metadata.AMELECO_group}{" "}
              group.
            </span>
            <div>
              <span className="text-lg font-bold">Account Information</span>
              <ChangeEmailForm email={data.email} />
              <ChangePasswordForm />
            </div>
            <div>
              <span className="text-lg font-bold">Profile Information</span>
              <ProfileForm
                additionalInfo={data.additionalInformation ?? ""}
                businessType={data.businessType ?? undefined}
                companyName={data.companyName ?? ""}
                firstName={data.firstName}
                lastName={data.lastName}
                occupation={data.occupation}
                phone={data.phone}
                purchaseFrequency={data.purchaseFrequency}
              />
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </main>
  );
};

export default Profile;

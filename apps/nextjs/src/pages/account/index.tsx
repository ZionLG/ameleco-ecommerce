import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  cn,
  Input,
  Select,
  SelectItem,
  SelectSection,
  Textarea,
} from "@nextui-org/react";
import type {
  BusinessType,
  Occupation,
  PurchaseFrequency,
} from "@prisma/client";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import {
  Briefcase,
  Dot,
  Eye,
  EyeOff,
  Home,
  Info,
  Lock,
  Mail,
  PhoneCall,
  User,
} from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/utils/api";
import AccountForm from "~/components/AccountForm";
import ProfileForm from "~/components/ProfileForm";
import { Button, buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

const Profile = () => {
  const session = useSessionContext();
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { data, isSuccess } = api.auth.me.useQuery();

  useEffect(() => {
    if (!session.isLoading && session.session == null) void router.push("/");
  }, [router, session]);

  return (
    <main className="container flex gap-10 p-10">
      <div className="flex h-fit w-64 flex-col items-start rounded-lg bg-background py-5 shadow-lg">
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
      <div className="flex h-fit w-full flex-col rounded-lg bg-background p-5 shadow-lg">
        <span className="text-2xl font-bold">My Profile</span>
        <Separator className="my-2" />
        {data && isSuccess && session.session && (
          <div className="flex flex-col gap-10">
            <span>
              You are in the {session.session.user.app_metadata.AMELECO_group}{" "}
              group.
            </span>
            <div>
              <span className="text-lg font-bold">Account Information</span>
              <AccountForm email={data.email} />
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
        )}
      </div>
    </main>
  );
};

export default Profile;

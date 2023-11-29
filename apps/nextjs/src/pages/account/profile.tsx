import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spinner } from "@nextui-org/spinner";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";

import { api } from "~/utils/api";
import ChangeEmailForm from "~/components/ChangeEmailForm";
import ChangePasswordForm from "~/components/ChangePasswordForm";
import DashboardLayout from "~/components/DashboardLayout";
import ProfileForm from "~/components/ProfileForm";
import { Separator } from "~/components/ui/separator";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/account/profile",
  },
  {
    title: "My Orders",
    href: "/account/orders",
  },
];

const Profile = () => {
  const session = useSessionContext();
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { data, isSuccess } = api.auth.me.useQuery();

  useEffect(() => {
    if (!session.isLoading && session.session == null) void router.push("/");
  }, [router, session]);
  return (
    <DashboardLayout items={sidebarNavItems}>
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
    </DashboardLayout>
  );
};

export default Profile;

import React from "react";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem, SelectSection } from "@nextui-org/select";
import type {
  BusinessType,
  Occupation,
  PurchaseFrequency,
} from "@prisma/client";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Briefcase, Home, Info, PhoneCall, User } from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";

interface ProfileEdit {
  firstName: string;
  companyName: string | undefined;
  lastName: string;
  phone: string;
  additionalInfo: string;
  occupation: Occupation;
  businessType: BusinessType | undefined;
  purchaseFrequency: PurchaseFrequency;
}
const ProfileForm = (profile: ProfileEdit) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileEdit>({
    defaultValues: { ...profile },
    mode: "onTouched",
  });
  const supabase = useSupabaseClient();
  const utils = api.useUtils();
  const { mutate, isLoading } = api.auth.updateProfile.useMutation({
    onSuccess: () => {
      void utils.auth.me.invalidate();
      toast.success("Profile updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const onSubmit: SubmitHandler<ProfileEdit> = async (newData) => {
    if (JSON.stringify(newData) !== JSON.stringify(profile)) {
      await supabase.auth.updateUser({
        data: {
          phone: newData.phone,
          company_name: newData.companyName,
          first_name: newData.firstName,
          last_name: newData.lastName,
          additional_info: newData.additionalInfo,
          occupation: newData.occupation,
          business_type: newData.businessType,
          purchase_frequency: newData.purchaseFrequency,
        },
      });

      mutate(newData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-5 flex  flex-col gap-7"
    >
      <div className="flex flex-col gap-2 rounded-xl  bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background p-3">
            <User size={24} className="text-blue-600" />
          </div>
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Controller
              name="firstName"
              control={control}
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  label="First Name"
                  variant="bordered"
                  isInvalid={!!errors.firstName}
                  errorMessage={!!errors.firstName && "First name is invalid"}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  label="Last Name"
                  variant="bordered"
                  isInvalid={!!errors.lastName}
                  errorMessage={!!errors.lastName && "Last name is invalid"}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-xl  bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background p-3">
            <PhoneCall size={24} className="text-blue-600" />
          </div>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: true,
              pattern: /^\D*([2-9]\d{2})(\D*)([2-9]\d{2})(\D*)(\d{4})\D*$/,
            }}
            render={({ field }) => (
              <Input
                type={"tel"}
                isRequired
                {...field}
                label="Phone Number"
                variant="bordered"
                isInvalid={!!errors.phone}
                errorMessage={!!errors.phone && "Phone number is invalid"}
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl  bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background p-3">
            <Briefcase size={24} className="text-blue-600 " />
          </div>
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Controller
              name="occupation"
              control={control}
              render={({ field }) => (
                <Select
                  isRequired
                  scrollShadowProps={{ isEnabled: false }}
                  {...field}
                  label="Occupation"
                  selectedKeys={[field.value]}
                  variant="bordered"
                >
                  <SelectItem key="HOME_OWNER">Home owner</SelectItem>
                  <SelectItem key="HANDY_MAN">Handy man</SelectItem>
                  <SelectItem key="RENOVATION_CONTRACTOR">
                    Renovation contractor
                  </SelectItem>
                  <SelectItem key="BUILDER">Builder</SelectItem>
                  <SelectItem key="GENERAL_CONTRACTOR">
                    General contractor
                  </SelectItem>
                  <SelectItem key="ELECTRICIAN">Electrician</SelectItem>
                  <SelectItem key="ELECTRICAL_CONTRACTOR">
                    Electrical Contractor
                  </SelectItem>
                  <SelectItem key="OTHER">Other</SelectItem>
                </Select>
              )}
            />

            <Controller
              name="purchaseFrequency"
              control={control}
              render={({ field }) => (
                <Select
                  isRequired
                  variant="bordered"
                  label="Purchase Frequency"
                  selectedKeys={[field.value]}
                  {...field}
                >
                  <SelectItem key="PROJECT_BASED">Project demand</SelectItem>
                  <SelectItem key="DAILY">Daily</SelectItem>
                  <SelectItem key="WEEKLY">Weeky</SelectItem>
                  <SelectItem key="BIWEEKLY">Bi-weekly</SelectItem>
                  <SelectItem key="MONTHLY">Monthly</SelectItem>
                  <SelectItem key="RARELY">Rarely</SelectItem>
                </Select>
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-xl  bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background p-3">
            <Home size={24} className="text-blue-600 " />
          </div>
          <div className="flex w-full flex-col gap-2 lg:flex-row">
            <Controller
              name="companyName"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Company name"
                  variant="bordered"
                  isInvalid={!!errors.companyName}
                  errorMessage={
                    !!errors.companyName && "Company name is Invalid"
                  }
                />
              )}
            />
            <Controller
              name="businessType"
              control={control}
              render={({ field }) => (
                <Select
                  label="Business Type"
                  {...field}
                  selectedKeys={field.value ? [field.value] : []}
                  variant="bordered"
                >
                  <SelectSection showDivider title="Residential">
                    <SelectItem key="RESIDENTIAL_RENOVATION">
                      Renovation
                    </SelectItem>
                    <SelectItem key="RESIDENTIAL_NEW_CONSTRUCTION">
                      New Construction
                    </SelectItem>
                  </SelectSection>
                  <SelectSection title="Commercial">
                    <SelectItem key="COMMERCIAL_RENOVATION">
                      Renovation
                    </SelectItem>
                    <SelectItem key="COMMERCIAL_NEW_CONSTRUCTION">
                      New Construction
                    </SelectItem>
                  </SelectSection>
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl  bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background p-3">
            <Info size={24} className="text-blue-600 " />
          </div>
          <Controller
            name="additionalInfo"
            control={control}
            render={({ field }) => (
              <Textarea
                label="Additional Information"
                {...field}
                variant="bordered"
              />
            )}
          />
        </div>
      </div>
      <Button disabled={isLoading} type="submit">
        Update
      </Button>
    </form>
  );
};

export default ProfileForm;

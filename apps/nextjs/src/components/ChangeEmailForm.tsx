import React, { useEffect } from "react";
import { Input } from "@nextui-org/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Mail } from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";

interface EmailEdit {
  email: string;
}

const ChangeEmailForm = ({ email }: EmailEdit) => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<EmailEdit>({
    defaultValues: { email: email },
    mode: "onTouched",
  });
  const supabase = useSupabaseClient();

  const onSubmit: SubmitHandler<EmailEdit> = async (newData) => {
    if (newData.email !== email) {
      const toastId = toast("Sonner");
      toast.loading("Loading...", {
        id: toastId,
      });

      const { data, error } = await supabase.auth.updateUser({
        email: newData.email,
      });

      if (data) {
        toast.success(
          `Verify the email change in both the current and new email.`,
          {
            id: toastId,
          },
        );
      } else if (error) {
        toast.error(`${error.message}`, {
          id: toastId,
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-5 flex items-center gap-7"
    >
      <div className="flex w-full flex-col gap-2 rounded-xl bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background  p-3">
            <Mail size={24} className="text-blue-600 " />
          </div>

          <Controller
            name="email"
            control={control}
            rules={{
              required: true,
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i,
            }}
            render={({ field }) => (
              <Input
                {...field}
                label="Email"
                variant="bordered"
                isInvalid={!!errors.email}
                errorMessage={!!errors.email && "Email is Invalid"}
              />
            )}
          />
        </div>
      </div>

      <Button disabled={email === watch("email")} type="submit">
        Update
      </Button>
    </form>
  );
};

export default ChangeEmailForm;

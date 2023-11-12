import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";

interface PasswordEdit {
  password: string;
}

const ChangePasswordForm = () => {
  const {
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useForm<PasswordEdit>({
    defaultValues: { password: "" },
    mode: "onTouched",
  });
  const supabase = useSupabaseClient();

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const onSubmit: SubmitHandler<PasswordEdit> = async (newData) => {
    const toastId = toast("Sonner");
    toast.loading("Loading...", {
      id: toastId,
    });

    const { data, error } = await supabase.auth.updateUser({
      password: newData.password,
    });

    if (data) {
      toast.success(`Password updated successfully.`, {
        id: toastId,
      });
      resetField("password");
    } else if (error) {
      toast.error(`${error.message}`, {
        id: toastId,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-5 flex items-center gap-7"
    >
      <div className="flex w-full flex-col gap-1 rounded-xl bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background  p-3">
            <Lock size={24} className="text-blue-600 " />
          </div>
          <Controller
            name="password"
            control={control}
            rules={{
              required: true,
              minLength: 6,
              maxLength: 72,
            }}
            render={({ field }) => (
              <Input
                {...field}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <Eye className="pointer-events-none text-2xl text-default-400" />
                    ) : (
                      <EyeOff className="pointer-events-none text-2xl text-default-400" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                variant="bordered"
                label="Password"
                isInvalid={!!errors.password}
                errorMessage={!!errors.password && "Password is Invalid"}
              />
            )}
          />
        </div>
      </div>

      <Button type="submit">Update</Button>
    </form>
  );
};

export default ChangePasswordForm;

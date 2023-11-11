import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";

interface ProfileEdit {
  email: string;
  password: string;
}

const AccountForm = ({ email }: { email: string }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileEdit>({
    defaultValues: { email: email, password: "" },
    mode: "onTouched",
  });
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const onSubmit: SubmitHandler<ProfileEdit> = async (newData) => {
    const toastId = toast("Sonner");
    toast.loading("Loading...", {
      id: toastId,
    });

    console.log("NEW", newData);
    console.log("OLD", email);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-5 flex  flex-col gap-7"
    >
      <div className="flex flex-col gap-2 rounded-xl  bg-secondary p-4">
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

      <div className="flex w-full flex-col gap-1 rounded-xl bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background  p-3">
            <Lock size={24} className="text-blue-600 " />
          </div>
          <Controller
            name="password"
            control={control}
            rules={{
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

      <Button type="submit">Edit</Button>
    </form>
  );
};

export default AccountForm;

import React from "react";
import { Input, Textarea } from "@nextui-org/input";
import { Info, Mail, Pen, User } from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "./ui/button";

interface Feedback {
  subject: string;
  message: string;
  email: string;
  name: string;
}
const FeedbackForm = () => {
  const {
    register,
    handleSubmit,
    resetField,
    control,
    formState: { errors },
  } = useForm<Feedback>({
    defaultValues: {
      email: "",
      message: "",
      name: "",
      subject: "",
    },
    mode: "onTouched",
  });
  const onSubmit: SubmitHandler<Feedback> = async (data) => {
    const toastId = toast("Sonner");
    toast.loading("Loading...", {
      id: toastId,
    });

    toast.success(`Feedback sent successfully.`, {
      id: toastId,
    });
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col gap-2  rounded-xl bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background  p-3">
            <Pen size={24} className="text-blue-600 " />
          </div>
          <Controller
            name="subject"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Input
                isRequired
                {...field}
                label="Subject"
                variant="bordered"
                isClearable
                onClear={() => {
                  resetField("subject");
                }}
                isInvalid={!!errors.subject}
                errorMessage={!!errors.subject && "Subject is Invalid"}
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl  bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background p-3">
            <Info size={24} className="text-blue-600 " />
          </div>
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <Textarea
                isRequired
                {...field}
                label="Message"
                variant="bordered"
              />
            )}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex w-full flex-col gap-2  rounded-xl bg-secondary p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-background  p-3">
              <Mail size={24} className="text-blue-600 " />
            </div>
            <Controller
              name="email"
              control={control}
              rules={{
                required: true,
                pattern: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/i,
              }}
              render={({ field }) => (
                <Input
                  isRequired
                  {...field}
                  label="Email"
                  variant="bordered"
                  isClearable
                  onClear={() => {
                    resetField("email");
                  }}
                  isInvalid={!!errors.email}
                  errorMessage={!!errors.email && "Email is Invalid"}
                />
              )}
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 rounded-xl  bg-secondary p-4 md:w-1/2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-background  p-3">
              <User size={24} className="text-blue-600 " />
            </div>
            <Controller
              name="name"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Input
                  isRequired
                  {...field}
                  label="Name"
                  variant="bordered"
                  isClearable
                  onClear={() => {
                    resetField("name");
                  }}
                  isInvalid={!!errors.name}
                  errorMessage={!!errors.name && "Name is Invalid"}
                />
              )}
            />
          </div>
        </div>
      </div>
      <Button size={"lg"}>Submit</Button>
    </form>
  );
};

export default FeedbackForm;

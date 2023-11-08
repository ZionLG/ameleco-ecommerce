import { useState } from "react";
import { Input } from "@nextui-org/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";

interface signInEmail {
  email: string;
  password: string;
}
const LoginEmailForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signInEmail>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });
  const supabase = useSupabaseClient();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const onSubmit: SubmitHandler<signInEmail> = async (data) => {
    const toastId = toast("Sonner");
    toast.loading("Loading...", {
      id: toastId,
    });

    const result = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (result.error) {
      toast.error(`${result.error.message}`, {
        id: toastId,
      });
    } else {
      toast.success(
        `Signed in as ${result.data.user?.user_metadata.first_name} ${result.data.user?.user_metadata.last_name}`,
        {
          id: toastId,
        },
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col  gap-7">
      <div className="flex flex-col gap-2 rounded-xl  bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background  p-3">
            <Mail size={24} className="text-blue-600 " />
          </div>
          <Input
            {...register("email", {
              required: true,
              pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i,
            })}
            label="Email"
            variant="bordered"
            isClearable
            isInvalid={!!errors.email}
            errorMessage={!!errors.email && "Email is Invalid"}
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-1 rounded-xl bg-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-background  p-3">
            <Lock size={24} className="text-blue-600 " />
          </div>

          <Input
            {...register("password", {
              required: true,
              pattern: /^.{6,}$/i,
            })}
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
        </div>
      </div>
      <Button>Login</Button>
    </form>
  );
};

export default LoginEmailForm;

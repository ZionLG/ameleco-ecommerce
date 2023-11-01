import React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { cn } from "~/utils/utils";
import RegisterEmailForm from "~/components/RegisterEmailForm";
import { buttonVariants } from "~/components/ui/button";

const Register = () => {
  return (
    <div className="flex min-h-screen  flex-col-reverse xl:flex-row">
      <div className=" bg-secondary flex shrink-0 flex-col justify-around p-5 md:p-24">
        <Image
          src={"registerlogin.svg"}
          priority
          height={600}
          width={600}
          alt="Register reasons"
          className="mb-16 self-center"
        />
        <div>
          <div className="mb-5 text-3xl font-bold">Welcome!</div>
          <div className="max-w-md text-xl">
            Choose Ameleco Electrical Supply for all your electrical supply
            needs!
          </div>
        </div>
      </div>
      <div className="my-10  flex grow flex-col items-center  justify-center p-5">
        <div className="flex flex-col  ">
          <div className="text-6xl font-bold">Welcome!</div>
          <div className="my-6 mb-5 text-2xl">
            Start Lorem ipsum dolor sit amet.
          </div>
          <RegisterEmailForm />

          <div className="mt-5 text-center text-gray-400">
            Already have an account?
            <Link
              href="/login"
              className={`${cn(
                buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: " text-md font-bold text-blue-500",
                }),
              )}`}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

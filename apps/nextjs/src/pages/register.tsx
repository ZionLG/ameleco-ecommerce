import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { cn } from "~/utils/utils";
import RegisterEmailForm from "~/components/RegisterEmailForm";
import { buttonVariants } from "~/components/ui/button";

const Register = () => {
  const session = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (session.session != null) {
      void router.push("/");
    }
  }, [router, session]);
  return (
    <main className="flex min-h-screen  flex-col-reverse xl:flex-row">
      <div className=" flex shrink-0 flex-col justify-around bg-secondary p-5 md:p-24">
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
    </main>
  );
};

export default Register;

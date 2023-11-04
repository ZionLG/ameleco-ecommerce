import { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { cn } from "~/utils/utils";
import AboutUsSection from "~/components/AboutUsSection";
import type { HomeCategoryProps } from "~/components/HomeCategory";
import HomeCategory from "~/components/HomeCategory";
import { Button, buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import Accessories from "../../public/Accessories.png";
import Box from "../../public/Box.png";
import Breaker from "../../public/Breaker.png";
import HeatingCooling from "../../public/heating and cooling.png";
import Lighting from "../../public/Lighting.png";
import Wires from "../../public/Wires.png";

const Categories = [
  {
    image: HeatingCooling,
    title: "Heating and Cooling",
    description: "Fans, Air Conditioners",
  },
  {
    image: Lighting,
    title: "Lighting",
    description: "Bulbs, Fixtures",
  },
  {
    image: Breaker,
    title: "Breaker",
    description: "Circuit Breaker, Single-pole",
  },
  {
    image: Box,
    title: "BOX",
    description: "Metal Box, PVC FS",
  },
  {
    image: Wires,
    title: "Wires",
    description: "Cable, Antishort",
  },
  {
    image: Accessories,
    title: "Accessories",
    description: "Lock Nut, Extension Ring",
  },
] as HomeCategoryProps[];

export default function HomePage() {
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabaseClient.from("product").select("*");
      if (error) {
        console.error(error);
      } else {
        console.log("SUPABASE DATA", data);
      }
    };
    void fetchData();
  }, [supabaseClient]);
  return (
    <>
      <Head>
        <title>Ameleco</title>
        <meta
          name="description"
          content="Best Electrical Wholesaler - near Vancouver, BC - for Residential, Commercial, Automation, Lighting, Fittings. Like Us - Facebook, YouTube, Instagram, Twitter."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex  flex-col">
        <section className="flex h-[650px] w-full flex-col  justify-center gap-4 bg-[url('/electrician.jpg')] bg-cover bg-center bg-no-repeat px-5 lg:px-28">
          <div className="flex flex-col gap-10 text-center lg:gap-0 lg:text-start ">
            <span className="text-6xl text-secondary-foreground">
              Ameleco Electrical Supply
            </span>
            <span className="text-4xl text-secondary-foreground">
              Reliable & Professional
            </span>
          </div>
          <Button className="self-center text-lg lg:self-start">
            Shop Now
          </Button>
        </section>
        <section className="flex flex-col items-center gap-10 bg-secondary py-10">
          <span className="px-3 text-center text-7xl font-semibold text-primary">
            Shop by Categories
          </span>
          <div className="grid grid-cols-1  gap-10  md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-6">
            {Categories.map((category) => {
              return (
                <div key={category.title}>
                  <HomeCategory
                    image={category.image}
                    title={category.title}
                    description={category.description}
                  />
                </div>
              );
            })}
          </div>
        </section>
        <AboutUsSection />
        <Separator className="my-4  w-5/6 self-center" />
        <section className="flex flex-col items-center gap-10 p-5">
          <span className="text-4xl font-semibold text-primary">
            Supplying British Columbia for 20+ years!
          </span>
          <div className="grid grid-rows-3 lg:grid-cols-3 lg:grid-rows-1 ">
            <div>
              <Image
                alt="Thanksgiving Promotion"
                src={"Thanksgiving.svg"}
                width={275}
                height={300}
              />
              <div className="flex h-64 w-[275px] flex-col gap-2 border p-3">
                <span className="text-2xl font-semibold text-primary">
                  THANKSGIVING PROMOTION
                </span>
                <p>
                  To express our sincere gratitude, we`re launching a special
                  sale from Thanksgiving Day October 9th until October 31st for
                  your coming projects.
                </p>
              </div>
            </div>
            <div>
              <Image
                alt="Careers"
                src={"CAREERS.svg"}
                width={275}
                height={300}
              />
              <div className="flex h-64 w-[275px] flex-col gap-2 border p-3 lg:border-y">
                <span className="text-2xl font-semibold text-primary">
                  CAREERS
                </span>
                <p>
                  We`re always looking for fresh blood! See career opportunities
                  at Ameleco today.
                </p>
              </div>
            </div>
            <div>
              <Image
                alt="Contact us"
                src={"contactus.svg"}
                width={275}
                height={300}
              />
              <div className="flex h-64 w-[275px] flex-col gap-2 border p-3">
                <span className="text-2xl font-semibold text-primary">
                  CONTACT US
                </span>
                <p>
                  Got any questions or want to chat with us further? Contact us
                  by email or by phone.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="mb-10 flex flex-col items-center gap-10 p-5">
          <span className="text-4xl font-semibold text-primary">
            Why Choose Us
          </span>
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="flex max-w-xs flex-col items-center text-center ">
              <Image
                priority
                src={"building.svg"}
                height={100}
                width={100}
                alt="Buildings"
              />
              <span className="font-medium text-secondary-foreground">
                CONTRIBUTED TO PROJECTS IN DIFFERENT SECTORS
              </span>
              <span className="font-semibold">
                Commercial, residential, industry materials, etc.
              </span>
            </div>
            <div className="flex max-w-xs flex-col items-center text-center ">
              <Image
                priority
                src={"experience.svg"}
                height={100}
                width={100}
                alt="Buildings"
              />
              <div className="flex flex-col gap-6">
                <span className="font-medium text-secondary-foreground">
                  VAST EXPERIENCE
                </span>
                <span className=" font-semibold">20+ years of experience</span>
              </div>
            </div>
            <div className="flex max-w-xs flex-col items-center text-center ">
              <Image
                priority
                src={"location.svg"}
                height={100}
                width={100}
                alt="Buildings"
                className="p-3"
              />
              <div className="flex flex-col gap-6">
                <span className="font-medium text-secondary-foreground">
                  BASED IN BRITISH COLUMBIA.
                </span>
                <span className=" font-semibold">
                  3 locations including Richmond, Burnaby, and Port Coquitlam.
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="flex text-xl">
          <div className="flex grow flex-col items-center justify-center gap-3 bg-secondary p-16 ">
            <span>Create Account to Shop Online</span>
            <Link href={"register"} className={`${cn(buttonVariants())}`}>
              Create Account
            </Link>
          </div>
          <div className="flex grow flex-col items-center justify-center gap-3 bg-[#343434] p-16 text-primary-foreground">
            <span>Find Items You Need</span>
            <Link
              href={"shop"}
              className={`${cn(
                buttonVariants({ variant: "ghost" }),
              )} bg-secondary-foreground`}
            >
              Shop Now
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

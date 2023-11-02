import { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import type { HomeCategoryProps } from "~/components/HomeCategory";
import HomeCategory from "~/components/HomeCategory";
import { Button } from "~/components/ui/button";
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
        <section className="flex h-[650px] w-full flex-col  justify-center gap-4 bg-[url('/electrician.jpg')] bg-center px-5 lg:px-28">
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
        <section className="flex flex-col items-center gap-10 p-5">
          <span className="text-7xl font-semibold text-primary">About Us</span>
          <div className="flex flex-col items-center gap-10 lg:flex-row">
            <div className="flex flex-col gap-5">
              <span className="text-4xl font-semibold text-primary">
                Who We Are
              </span>
              <p className="max-w-lg text-lg">
                Ameleco Electric Supply has electrical stores near Vancouver in
                Richmond, Port Coquitlam and Burnaby. Shop at your nearest
                Ameleco Electrical Store today! <br />
                <br />
                Ameleco is one of the largest electrical wholesale suppliers
                providing a wide range of products for residential electricians
                and commercial contractors in BC. We carry comprehensive product
                solutions for Lighting, Datacom, Wire & Cable, Power Management
                and Electrical Supplies. <br />
                <br />
                In addition to our online store, we have a variety of choice
                throughout Canada where our customers can find what they need
                for their specific electrical projects as well as product
                knowledge and expertise from our staff.
              </p>
            </div>
            <div>
              <Image
                priority
                src={"about.svg"}
                height={300}
                width={300}
                alt="Visit us 10535 120 ST, SURREY"
              />
            </div>
          </div>
        </section>
        <Separator className="my-4  w-5/6 self-center" />
        <section className="flex flex-col items-center gap-10 p-5">
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
      </main>
    </>
  );
}

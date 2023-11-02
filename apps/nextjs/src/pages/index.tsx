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
        <div className="flex h-[650px] w-full flex-col justify-center gap-4 bg-[url('/electrician.jpg')] bg-center px-40">
          <div className="flex flex-col ">
            <span className="text-foreground text-6xl">
              Ameleco Electrical Supply
            </span>
            <span className="text-4xl">Reliable & Professional</span>
          </div>
          <Button className="self-start text-lg">Shop Now</Button>
        </div>
        <div className="bg-secondary flex flex-col items-center gap-10 py-5">
          <span className="text-primary text-7xl font-semibold">
            Shop by Categories
          </span>
          <div className="flex gap-10">
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
        </div>
        <div className="flex flex-col items-center gap-10 p-5">
          <span className="text-primary text-7xl font-semibold">About Us</span>
          <div className="flex items-center gap-10">
            <div className="flex flex-col gap-5">
              <span className="text-primary text-4xl font-semibold">
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
        </div>
        <Separator className="my-4" />
      </main>
    </>
  );
}

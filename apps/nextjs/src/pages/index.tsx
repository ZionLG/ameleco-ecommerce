import { useEffect } from "react";
import Head from "next/head";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import type { HomeCategoryProps } from "~/components/HomeCategory";
import HomeCategory from "~/components/HomeCategory";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";
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
  const user = useUser();
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
            <span className="text-6xl">Ameleco Electrical Supply</span>
            <span className="text-4xl">Reliable & Professional</span>
          </div>
          <Button className="self-start text-lg">Shop Now</Button>
        </div>
        <div className="bg-secondary flex flex-col items-center gap-10 py-5">
          <span className="text-7xl font-semibold">Shop by Categories</span>
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
        <ThemeToggle />
        <pre> {JSON.stringify(user, null, 4)}</pre>
      </main>
    </>
  );
}

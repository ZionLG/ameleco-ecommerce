import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import Header from "~/components/Header";
import { ThemeToggle } from "~/components/ThemeToggle";
import electrician from "../../public/electrician.jpg";

export default function HomePage() {
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
      <Header />
      <main className=" flex h-screen  flex-col">
        <div className=" flex flex-col items-center justify-center gap-4 ">
          <div className="h-[650px] w-full bg-[url('/electrician.jpg')] bg-center"></div>
        </div>
      </main>
    </>
  );
}

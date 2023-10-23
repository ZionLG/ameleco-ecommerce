import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import Header from "~/components/Header";
import ProductSearch from "~/components/ProductSearch";
import { ThemeToggle } from "~/components/ThemeToggle";

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
      <main className="flex h-screen flex-col  ">
        <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8"></div>
      </main>
    </>
  );
}

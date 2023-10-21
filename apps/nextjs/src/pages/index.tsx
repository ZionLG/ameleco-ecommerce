import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import ProductSearch from "~/components/ProductSearch";

export default function HomePage() {
  const postQuery = api.post.all.useQuery();

  const deletePostMutation = api.post.delete.useMutation({
    onSettled: () => postQuery.refetch(),
  });

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
      <main className="flex h-screen flex-col  bg-white text-zinc-900">
        <header className="flex flex-col gap-3 p-5">
          <div className="flex">
            <span className="text-5xl font-bold uppercase italic text-[#0070C0]">
              AMELECO
            </span>
            <ProductSearch data={[]} />
          </div>
          <nav></nav>
        </header>
        <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8"></div>
      </main>
    </>
  );
}

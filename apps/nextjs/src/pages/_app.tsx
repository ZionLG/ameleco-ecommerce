import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/auth-helpers-nextjs";
import { ThemeProvider } from "next-themes";

import "../styles/globals.css";

import { useState } from "react";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { api } from "~/utils/api";
import Layout from "~/components/layout";
import { env } from "~/env.mjs";

function MyApp({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session | null }>) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient({
      supabaseKey: env.NEXT_PUBLIC_ANON_KEY,
      supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
    }),
  );

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ThemeProvider attribute="class" defaultTheme="white" enableSystem>
        <NextUIProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NextUIProvider>
      </ThemeProvider>
    </SessionContextProvider>
  );
}

export default api.withTRPC(MyApp);

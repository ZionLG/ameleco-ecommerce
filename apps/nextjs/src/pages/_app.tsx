import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/auth-helpers-nextjs";
import { ThemeProvider } from "next-themes";

import "../styles/globals.css";

import { useState } from "react";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { api } from "~/utils/api";

function MyApp({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session | null }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <NextUIProvider>
          <Component {...pageProps} />
        </NextUIProvider>
      </ThemeProvider>
    </SessionContextProvider>
  );
}

export default api.withTRPC(MyApp);

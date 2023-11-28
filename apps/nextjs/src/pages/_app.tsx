import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/auth-helpers-nextjs";
import { ThemeProvider } from "next-themes";

import "../styles/globals.css";

import { useState } from "react";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Encode_Sans_Expanded } from "next/font/google";
import { useRouter } from "next/router";
import { NextUIProvider } from "@nextui-org/react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { api } from "~/utils/api";
import Layout from "~/components/layout";
import { env } from "~/env.mjs";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout<T> = AppProps<T> & {
  Component: NextPageWithLayout<T>;
};
const encode_Sans_Expanded = Encode_Sans_Expanded({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

function MyApp({
  Component,
  pageProps,
}: AppPropsWithLayout<{ initialSession: Session | null }>) {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      supabaseKey: env.NEXT_PUBLIC_ANON_KEY,
      supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
    }),
  );
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ThemeProvider attribute="class" defaultTheme="white" enableSystem>
        <NextUIProvider navigate={router.push}>
          <Layout>
            {/* eslint-disable-next-line react/no-unknown-property*/}
            <style jsx global>{`
              html {
                font-family: ${encode_Sans_Expanded.style.fontFamily};
              }
            `}</style>
            {getLayout(<Component {...pageProps} />)}
          </Layout>
        </NextUIProvider>
      </ThemeProvider>
    </SessionContextProvider>
  );
}

export default api.withTRPC(MyApp);

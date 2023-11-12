import type { SessionContext } from "@supabase/auth-helpers-react";
import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ShouldShowPrice(key: string, session: SessionContext) {
  return (
    (key.toUpperCase() === session.session?.user?.app_metadata.AMELECO_group &&
      session.isLoading == false) ||
    (session.session == null && session.isLoading == false)
  );
}

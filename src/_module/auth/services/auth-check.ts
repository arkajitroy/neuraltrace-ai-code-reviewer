"use server";

import { getSession } from "@/lib/sessions";
import { redirect } from "next/navigation";

export const requireAuthentication = async (callbackUrl?: string) => {
  const session = await getSession();
  if (!session?.user) {
    const redirectUrl = callbackUrl
      ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/sign-in";
    redirect(redirectUrl as any);
  }
  return session;
};

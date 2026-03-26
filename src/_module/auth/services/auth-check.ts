"use server";

import { getAppSession } from "@/lib/sessions";
import { redirect } from "next/navigation";

export const requireAuthentication = async () => {
  const session = await getAppSession();
  if (!session) redirect("/sign-in");
  return session;
};

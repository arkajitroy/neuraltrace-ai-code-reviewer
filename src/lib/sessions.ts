import { headers } from "next/headers";
import { auth } from "./auth";

export async function getAppSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized: No active session");
  }

  return session;
}

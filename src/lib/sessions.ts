import { headers } from "next/headers";
import { auth } from "./auth";

export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
}

export async function getAppSession() {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("Unauthorized: No active session");
  }

  return session;
}

import { requireAuthentication } from "@/_module/auth/services/auth-check";
import { redirect } from "next/navigation";

export default async function RootPage() {
  await requireAuthentication();

  // authenticated user will be automatically redirected to the dashboard
  return redirect("/dashboard");
}

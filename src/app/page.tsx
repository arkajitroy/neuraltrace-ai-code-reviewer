import { redirect } from "next/navigation";

export default function RootPage() {
  // Edge proxy handles conditional routing (/dashboard vs /sign-in).
  // Default fallback for direct hits or static export redirects to /sign-in.
  redirect("/sign-in");
}

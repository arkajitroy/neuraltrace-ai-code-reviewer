import AppLayout from "@/components/layouts/app-layout";
import { PropsWithChildren } from "react";

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return <AppLayout>{children}</AppLayout>;
}

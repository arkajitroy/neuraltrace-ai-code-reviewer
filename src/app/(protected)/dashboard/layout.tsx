import { PropsWithChildren } from "react";
import { Metadata } from "next";
import DashboardSidebar from "@/_module/dashboard/components/dashboard-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Dashboard | Neuraltrace Code Reviewer",
  description: "",
};

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <h1 className="text-foreground text-xl font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

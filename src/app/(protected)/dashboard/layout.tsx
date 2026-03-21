import { Metadata } from "next";
import { PropsWithChildren } from "react";
import DashboardSidebar from "@/_module/dashboard/components/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import DashboardHeader from "@/_module/dashboard/components/dashboard-header";

export const metadata: Metadata = {
  title: "Dashboard | Neuraltrace Code Reviewer",
  description: "AI-powered code review and semantic analysis dashboard",
};

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset
        className={cn(
          // Set content container, so we can use container queries
          "@container/content",

          // If layout is fixed, set the height
          // to 100svh to prevent overflow
          "has-data-[layout=fixed]:h-svh",

          // If layout is fixed and sidebar is inset,
          // set the height to 100svh - spacing (total margins) to prevent overflow
          "peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]",
        )}
      >
        {/* <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <span className="text-sm font-medium text-muted-foreground">Workspace</span>
          </div>
        </header> */}
        <DashboardHeader />
        <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

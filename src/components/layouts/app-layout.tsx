import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import DashboardSidebar from "@/_module/dashboard/components/dashboard-sidebar";
import DashboardHeader from "@/_module/dashboard/components/dashboard-header";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset
        className={cn(
          "@container/content",
          "has-data-[layout=fixed]:h-svh",
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
